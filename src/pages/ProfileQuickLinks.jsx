import { Button, Grid, Icon, Text } from '@chakra-ui/react'
import { LuMessageSquare, LuPackage, LuSettings, LuSparkles } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

const links = [
  { label: '주문', icon: LuPackage, path: '/orders' },
  { label: '추천내역', icon: LuSparkles, path: '/ai/history' },
  { label: '커뮤니티', icon: LuMessageSquare, path: '/community/main' },
  { label: '설정', icon: LuSettings },
]

export const ProfileQuickLinks = () => {
  const navigate = useNavigate()

  return (
    <Grid
      as="nav"
      aria-label="자주 찾는 메뉴"
      templateColumns="repeat(4, minmax(0, 1fr))"
      gap={ 4 }
      padding={ 4 }
      rounded="2xl"
      borderWidth="thin"
      borderColor="border.subtle"
      bg="bg.panel"
    >
      { links.map(({ label, icon: LinkIcon, path }) => (
        <Button
          key={ label }
          variant="ghost"
          height={ 12 }
          minWidth={ 0 }
          paddingX={ { base: 0, md: 4 } }
          gap={ 4 }
          rounded="xl"
          disabled={ !path }
          title={ path ? undefined : '준비 중이에요' }
          onClick={ () => path && navigate(path) }
          _hover={ { bg: 'bg.subtle' } }
        >
          <Icon display={ { base: 'none', sm: 'inline-flex' } }>
            <LinkIcon/>
          </Icon>
          <Text textStyle={ { base: 'xs', md: 'sm' } }>{ label }</Text>
        </Button>
      )) }
    </Grid>
  )
}