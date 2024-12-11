import { Badge, Flex, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export const TodoCard = ({todo}) => {
    const navigate = useNavigate();
    return (
        <Flex bg='brand.200' minHeight='3rem' my={3} p={3} rounded='lg' alignItems='center' justifyContent='space-between' _hover={{
            opacity: 0.9,
            cursor:'pointer',
            transform:"translateY(-3px)"}} onClick={()=> navigate(`/${todo.todo_id}`, {replace: true})} >
                <Text>
                    {todo.title}
                </Text>
                <Badge colorScheme={todo.status? 'green' : 'gray'}>
                    {todo.status? 'Complete' : 'Pending'}
                </Badge>
        </Flex>
    )
}
