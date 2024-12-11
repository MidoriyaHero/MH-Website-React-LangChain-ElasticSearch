import { Box, Center, Container, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../services/axios';
import { JournalCard } from './JournalCard';
import { CRUDJournal } from './CRUDJournal';
import { LeftNav } from '../navbar/LeftNav';

export const JournalList = () => {
    const [Journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(false);
    useEffect(() => {
        if (isMounted.current) return;
        fetchJournal();
        isMounted.current = true
    }, [])

    const fetchJournal = () => {
        setLoading(true)
        axiosInstance.get('/journal/')
        .then((response) =>{
            setJournals(response.data)
        }).catch ((error) => {
            console.log(error)
        }).finally(() => {
            setLoading(false)
        })
    }
    return (
    <Flex h="100vh">
        <Box w="15%">
        <LeftNav />
      </Box>
    
    <Container mt={9} w="55%" bg="white" justify="center" align="center">
        <CRUDJournal onSuccess={fetchJournal} />
        {loading ? (
            <Center mt={6} >
                <Spinner thickness='4px' speed='0.5s' emptyColor='green.100' color="green.100" />
            </Center>
        ):(
            <Box mt={6}>
                {Journals?.map((Journal) =>(
                    <JournalCard Journal = {Journal} key = {Journal.id}/>
                ))}
            </Box>
        )}
        
    </Container>
    </Flex>
    )
}
