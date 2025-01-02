import { Badge, Flex, Text } from "@chakra-ui/react"

export const JournalCard = ({ journal, isSelected, onSelect }) => {
    return (
        <Flex 
            bg={isSelected ? 'brand.300' : 'brand.200'} 
            minHeight='3rem' 
            my={3} 
            p={3} 
            rounded='lg' 
            alignItems='center' 
            justifyContent='space-between' 
            _hover={{
                opacity: 0.9,
                cursor:'pointer',
                transform:"translateY(-3px)"
            }} 
            onClick={() => onSelect(journal.journal_id)}
        >
            <Text>
                {journal.title}
            </Text>
            <Badge colorScheme={journal.status? 'green' : 'gray'}>
                {journal.status? 'Complete' : 'Pending'}
            </Badge>
        </Flex>
    )
}
