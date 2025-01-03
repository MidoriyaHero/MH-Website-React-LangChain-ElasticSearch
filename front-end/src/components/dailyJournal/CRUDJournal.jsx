import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../services/axios'

export const CRUDJournal = ({ editable = false, defaultValues = {}, onSuccess, journalId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const { register, handleSubmit, reset } = useForm({
        defaultValues: defaultValues
    })

    const onSubmit = async (data) => {
        try {
            if (editable && journalId) {
                // Update existing journal
                await axiosInstance.put(`/journal/${journalId}`, data)
                toast({
                    title: 'Updated!',
                    status: 'success',
                    isClosable: true,
                    duration: 3000
                })
            } else {
                // Create new journal
                await axiosInstance.post('/journal/create', data)
                toast({
                    title: 'Created!',
                    status: 'success',
                    isClosable: true,
                    duration: 3000
                })
                reset()
            }
            onSuccess()
            onClose()
        } catch (error) {
            toast({
                title: 'Something went wrong, please try again!',
                status: 'error',
                isClosable: true,
                duration: 3000
            })
        }
    }

    return (
        <>
            <Button
                variant='calming'
                onClick={onOpen}
                width={editable ? '100%' : 'auto'}
                mt={3}
            >
                {editable ? 'Edit' : 'Create New Journal'}
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>{editable ? 'Edit Journal' : 'Create New Journal'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Title</FormLabel>
                                <Input {...register('title')} />
                            </FormControl>
                            <FormControl mt={3}>
                                <FormLabel>Description</FormLabel>
                                <Textarea {...register('description')} />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant='ghost' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button type='submit' variant='calming'>
                                {editable ? 'Save Changes' : 'Create'}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}
