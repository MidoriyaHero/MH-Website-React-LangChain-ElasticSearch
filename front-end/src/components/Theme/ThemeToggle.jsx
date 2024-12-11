import {Switch, useColorMode, FormLabel} from '@chakra-ui/react'

export const ThemeToggle = ({showLable= false, ...rest}) => {

    const {toggleColorMode, colorMode}= useColorMode();

  return (
    <>
    {showLable&&(
        <FormLabel htmlFor='theme-toggle' textColor='orange' mb ={0}>
            Enable Dark Theme
        </FormLabel>
    )}
    <Switch id='theme-toggler' size='sm' 
    isChecked ={colorMode === 'dark'} 
    isDisabled={false} 
    value={colorMode}
    colorScheme='green'
    mr={2}
    onChange={toggleColorMode}
    {...rest}>

    </Switch>
    </>
  )
}
