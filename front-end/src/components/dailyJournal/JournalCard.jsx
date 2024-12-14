import { Badge, Flex, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export const JournalCard = ({Journal}) => {
    const navigate = useNavigate();
    return (
        <Flex bg='brand.200' minHeight='3rem' my={3} p={3} rounded='lg' alignItems='center' justifyContent='space-between' _hover={{
            opacity: 0.9,
            cursor:'pointer',
            transform:"translateY(-3px)"}} onClick={()=> navigate(`/service/journal/${Journal.journal_id}`, {replace: true})} >
                <Text>
                    {Journal.title}
                </Text>
                <Badge colorScheme={Journal.status? 'green' : 'gray'}>
                    {Journal.status? 'Complete' : 'Pending'}
                </Badge>
        </Flex>
    )
}
