import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import  axiosInstance  from '../../services/axios'
import { Button, Center, Container, Spinner, Text, useToast } from "@chakra-ui/react"
import { CRUDJournal } from "./CRUDJournal"

export const JournalDetail = () => {
    const [Journal, setJournal] = useState({})
    const [loading, setLoading] = useState(true)
    const isMounted = useRef(false)
    const {JournalId} = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    useEffect(() =>{
        if (isMounted.current) return;
        fetchJournal();
        isMounted.current = true
    }, [JournalId])

    const fetchJournal = () => {
        setLoading(true)
        axiosInstance.get(`/journal/${JournalId}`)
        .then((response) =>{
            setJournal(response.data)
        })
        .catch((error) => console.log(error))
        .finally(() => {
            setLoading(false)
        })
    }
    const delJournal = () => {
      setLoading(true)
      axiosInstance.delete(`/journal/${JournalId}`)
      .then(() =>{
        toast({
          title: 'Deleted!',
          status: 'success',
          isClosable: true,
          duration: 3000
        })
        navigate('/service/journal')
      })
      .catch((error) => toast({
        title: 'Something went wrong, please try again!',
        status: 'error',
        isClosable: true,
        duration: 3000
      }))
      .finally(() => {
        setLoading(false)
      })
    }
    if (loading) {
        return (
            <Container>
                <Center mt={6} >
                    <Spinner thickness='4px' speed='0.5s' emptyColor='brand.200' color="brand.500" />
                </Center>
            </Container>
        )
    }
    return (
        <>
      <Container mt={6} >
      <Button
        variant='calming'
        onClick={() => navigate("/service/journal", { replace: true })}
      >
        Back
      </Button>
      </Container>
      <Container
        bg='brand.200'
        minHeight="7rem"
        my={3}
        p={3}
        rounded="lg"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize={22}>{Journal.title}</Text>
        <Text bg="brand.100" mt={2} p={2} rounded="lg">
          {Journal.description}
        </Text>
        <CRUDJournal
          my={3}
          editable={true}
          defaultValues={{
            title: Journal.title,
            description: Journal.description,
            status: Journal.status,
          }}
          onSuccess={fetchJournal}
        />
        <Button isLoading={loading} bg="complementary.red" width='100%' mt='3' onClick={delJournal} _hover='complementary.red'>
          Delete
        </Button>
        </Container>
        </>
    )
}
