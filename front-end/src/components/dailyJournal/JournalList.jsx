import { Box, Center, Container, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../services/axios';
import { JournalCard } from './JournalCard';
import { CRUDJournal } from './CRUDJournal';
import { LeftNav } from '../navbar/LeftNav';
import { JournalDetail } from './JournalDetail';
import { useColorMode } from '@chakra-ui/react';

export const JournalList = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJournalId, setSelectedJournalId] = useState(null);
    const isMounted = useRef(false);
    const { colorMode } = useColorMode();

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

    const handleJournalSelect = (journalId) => {
        setSelectedJournalId(journalId);
    }

    return (
        <Flex h="100vh">
            <Box w="15%">
                <LeftNav />
            </Box>
            
            {/* Journal List Section */}
            <Container mt={9} w="40%" bg={colorMode === 'light' ? 'white' : 'gray.800'} justify="center" align="center">
                <Flex justify="space-between" align="center" mb={4}>
                    <Text fontWeight="bold" fontSize="xl">Nhật ký</Text>
                </Flex>
                <CRUDJournal onSuccess={fetchJournal} />
                {loading ? (
                    <Center mt={6}>
                        <Spinner thickness='4px' speed='0.5s' emptyColor='green.100' color="green.100" />
                    </Center>
                ):(
                    <Box mt={6}>
                        {journals?.map((journal) =>(
                            <JournalCard 
                                journal={journal} 
                                key={journal.journal_id}
                                isSelected={selectedJournalId === journal.journal_id}
                                onSelect={handleJournalSelect}
                            />
                        ))}
                    </Box>
                )}
            </Container>

            {/* Journal Detail Section */}
            <Box w="45%" mt={9} pr={4}>
                {selectedJournalId ? (
                    <JournalDetail journalId={selectedJournalId} onUpdate={fetchJournal} />
                ) : (
                    <Center h="100%" bg="brand.50" rounded="lg">
                        <Text color="gray.500">Select a journal to view details</Text>
                    </Center>
                )}
            </Box>
        </Flex>
    )
}
