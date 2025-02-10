import { useEffect, useState } from "react"
import  axiosInstance  from '../../services/axios'
import { Button, Center, Container, Spinner, Text, useToast, Tag, Wrap, WrapItem, Box, Flex, useBreakpointValue } from "@chakra-ui/react"
import { CRUDJournal } from "./CRUDJournal"

export const JournalDetail = ({ journalId, onUpdate }) => {
    const [journal, setJournal] = useState({})
    const [loading, setLoading] = useState(true)
    const toast = useToast()
    const isMobile = useBreakpointValue({ base: true, lg: false });

    useEffect(() => {
        if (!journalId) return;
        fetchJournal();
    }, [journalId])

    const fetchJournal = () => {
        setLoading(true)
        axiosInstance.get(`/journal/${journalId}`)
        .then((response) => {
            setJournal(response.data)
        })
        .catch((error) => console.log(error))
        .finally(() => {
            setLoading(false)
        })
    }

    const delJournal = () => {
        setLoading(true)
        axiosInstance.delete(`/journal/${journalId}`)
        .then(() => {
            toast({
                title: 'Deleted!',
                status: 'success',
                isClosable: true,
                duration: 3000
            })
            onUpdate()
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

    const getSentimentColor = (sentiment) => {
        switch(sentiment) {
            case 'TÍCH CỰC':
                return 'green';
            case 'TIÊU CỰC':
                return 'red';
            default:
                return 'gray';
        }
    }

    if (loading) {
        return (
            <Container>
                <Center mt={6}>
                    <Spinner thickness='4px' speed='0.5s' emptyColor='brand.200' color="brand.500" />
                </Center>
            </Container>
        )
    }

    return (
        <Container
            bg='brand.200'
            minHeight="7rem"
            p={isMobile ? 4 : 3}
            rounded="lg"
            alignItems="center"
            justifyContent="space-between"
            maxW={isMobile ? "100%" : "container.md"}
        >
            <Text fontSize={22}>{journal.title}</Text>
            <Text bg="brand.100" mt={2} p={2} rounded="lg">
                {journal.description}
            </Text>

            {/* Add Evaluation Results Section */}
            {journal.is_evaluated && (
                <Box mt={4} p={3} bg="brand.100" rounded="lg">
                    <Text fontSize={18} fontWeight="bold" mb={2}>
                        Phân tích cảm xúc
                    </Text>
                    
                    {/* Sentiment Analysis */}
                    <Tag 
                        size="lg" 
                        colorScheme={getSentimentColor(journal.sentiment_analysis)}
                        mb={3}
                    >
                        {journal.sentiment_analysis}
                    </Tag>

                    {/* Emotions */}
                    {journal.emotions && journal.emotions.length > 0 && (
                        <>
                            <Text fontSize={16} fontWeight="semibold" mb={2}>
                                Cảm xúc:
                            </Text>
                            <Wrap spacing={isMobile ? 2 : 3} justify={isMobile ? "center" : "flex-start"} mb={3}>
                                {journal.emotions.map((emotion, index) => (
                                    <WrapItem key={index}>
                                        <Tag size="md" colorScheme="purple">
                                            {emotion}
                                        </Tag>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        </>
                    )}

                    {/* Themes */}
                    {journal.themes && journal.themes.length > 0 && (
                        <>
                            <Text fontSize={16} fontWeight="semibold" mb={2}>
                                Từ khóa:
                            </Text>
                            <Wrap spacing={isMobile ? 2 : 3} justify={isMobile ? "center" : "flex-start"} mb={3}>
                                {journal.themes.map((theme, index) => (
                                    <WrapItem key={index}>
                                        <Tag size="md" colorScheme="blue">
                                            {theme}
                                        </Tag>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        </>
                    )}

                    {/* Last Evaluated Time */}
                    <Text fontSize="sm" color="gray.600" mt={2}>
                        Đánh giá lần cuối: {new Date(journal.last_evaluated_at).toLocaleString('vi-VN')}
                    </Text>
                </Box>
            )}

            <Flex direction={isMobile ? "column" : "row"} gap={3} width="100%">
                <CRUDJournal
                    editable={true}
                    defaultValues={{
                        title: journal.title,
                        description: journal.description,
                        status: journal.status,
                    }}
                    journalId={journalId}
                    onSuccess={() => {
                        fetchJournal();
                        onUpdate();
                    }}
                />
                <Button 
                    isLoading={loading} 
                    bg="complementary.red" 
                    width='100%' 
                    onClick={delJournal} 
                    _hover={{ bg: 'red.600' }}
                >
                    Xóa
                </Button>
            </Flex>
        </Container>
    )
}
