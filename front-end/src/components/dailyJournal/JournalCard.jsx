import { Badge, Flex, Text, useBreakpointValue } from "@chakra-ui/react"

export const JournalCard = ({ journal, isSelected, onSelect }) => {
    const isMobile = useBreakpointValue({ base: true, lg: false });
    
    return (
        <Flex 
            bg={isSelected ? 'brand.300' : 'brand.200'} 
            minHeight='3rem' 
            my={3} 
            p={3} 
            rounded='lg' 
            alignItems='center' 
            justifyContent='space-between'
            flexDirection={isMobile ? 'column' : 'row'}
            gap={isMobile ? 2 : 0}
            _hover={{
                opacity: 0.9,
                cursor:'pointer',
                transform:"translateY(-3px)"
            }} 
            onClick={() => onSelect(journal.journal_id)}
        >
            <Text textAlign={isMobile ? 'center' : 'left'}>
                {journal.title}
            </Text>
            <Badge colorScheme={journal.status? 'green' : 'gray'}>
                {journal.status? 'Complete' : 'Pending'}
            </Badge>
        </Flex>
    )
}
