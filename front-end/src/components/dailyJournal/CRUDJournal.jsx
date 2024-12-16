import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Switch, Textarea, useDisclosure, useToast } from "@chakra-ui/react"
import { Controller, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import axiosIntance from '../../services/axios'

export const CRUDJournal = ({
  editable = false,
  defaultValues = {},
  onSuccess = () => {},
  ...rest
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const toast =  useToast()
  const {JournalId} = useParams()
  const {handleSubmit, register, control, formState:{errors, isSubmitting }} = useForm({
    defaultValues: {...defaultValues}
  })
  const onSubmit = async (values) => {
    try {
      if (editable) {
        await axiosIntance.put(`/journal/${JournalId}`, values)
      } else {
        await axiosIntance.post(`/journal/create`, values)
      }
      toast({
        title: editable? 'journal Updated' : 'journal Added',
        status: 'success',
        isClosable: true,
        duration: 3000
      })
      onSuccess();
      onClose()

    } catch (error) {
      console.error(error)
      toast({
        title: 'Something went wrong, please try again!',
        status: 'error',
        isClosable: true,
        duration: 3000
      })
    }
  }
  return (
    <Box>
      <Button w='100%' onClick={onOpen} mt='3'>
        {editable? 'Update' : 'Add' }
      </Button>
      <Modal closeOnOverlayClick={false} size='xl' onClose={onClose} isOpen={isOpen} isCentered >
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)} >   
          <ModalContent>
            <ModalHeader>
              {editable? 'Update' : 'Add'}
            </ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <FormControl isInvalid={errors.title} >
              <Input
                  placeholder='journal Title'
                  background={('brand.100')}
                  type='text'
                  variant='filled'
                  size='lg'
                  mt={6}
                  {...register('title',{
                      required: "This is required field!!!"
                  })}
                  />
                  <FormErrorMessage>
                    {errors.title && errors.title.message}
                  </FormErrorMessage>
              </FormControl>

              <FormControl>
              <Textarea
                  rows={5}
                  placeholder='Add description'
                  background={('brand.100')}
                  type='text'
                  variant='filled'
                  size='lg'
                  mt={6}
                  {...register('description',{
                      required: "This is required field!!!"
                  })}
                  />
                  <FormErrorMessage>
                    {errors.description && errors.description.message}
                  </FormErrorMessage>
              </FormControl>
              <Controller control = {control} name='status' render={({field}) => (
                <FormControl mt={6} display='flex' alignItems='center' >
                  <FormLabel htmlFor="is-done" >
                    Status 
                  </FormLabel>
                  <Switch 
                  onChange={(e) => field.onChange(e.target.checked)}
                  isChecked={field.value}
                  id='id-done'
                  size='lg'
                  name='status'
                  isDisabled={false}
                  isLoading={false}
                  colorScheme="brand"
                  variant='ghost'  />
                </FormControl>
              )} />
            </ModalBody>
            <ModalFooter>
              <Stack direction='row' spacing={4} >
                <Button onClick={onClose} disabled={isSubmitting} >
                  Close
                </Button>
                <Button colorScheme="brand" type='submit' isLoading={isSubmitting} loadingText={editable? 'Updating': 'Creating'}  >
                  {editable? 'Update': 'Create'}
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  )
}
