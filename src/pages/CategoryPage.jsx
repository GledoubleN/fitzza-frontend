import { useState } from 'react'
import { Box, Button, Container, Grid, GridItem, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { LuChevronRight } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { categories } from '../data/categories.js'

export const CategoryPage = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(categories[0])
  const sections = selected.sections ?? [selected]

  // 임시용 코드, 추후 BE 계약 완료시 수정 필요, TO-DO-NEXT
  const search = (query) => navigate(`/search?${ new URLSearchParams({ q: query }) }`)

  return (
    <>
    <Container maxWidth={ 'xl' }>
      <Stack paddingY={ '4' } paddingBottom="96px" height={ '100vh' } gap={ '4' }>
        <AppBar></AppBar>
        <Heading size={ 'xl' }>카테고리</Heading>
        <Grid templateColumns={ '7rem 1fr' } gap={ '4' } flex={ '1' } minHeight={ '0' }>
          <GridItem overflowY={ 'auto' }>
            <Stack gap={ '1' }>
              {
                categories.map((category) => (
                  <Button
                    key={ category.name }
                    variant={ selected.name === category.name ? 'subtle' : 'ghost' }
                    justifyContent={ 'flex-start' }
                    onClick={ () => setSelected(category) }
                  >
                    { category.name }
                  </Button>
                ))
              }
            </Stack>
          </GridItem>
          <GridItem overflowY={ 'auto' }>
            <Stack gap={ '6' } paddingRight={ '2' }>
              {
                sections.map((section) => (
                  <Box key={ section.name }>
                    <Button
                      variant={ 'ghost' }
                      width={ 'full' }
                      justifyContent={ 'space-between' }
                      onClick={ () => search(section.name) }
                    >
                      <Heading size={ 'md' }>{ section.name }</Heading>
                      <Icon><LuChevronRight></LuChevronRight></Icon>
                    </Button>
                    <SimpleGrid columns={ 2 } gap={ '1' }>
                      {
                        section.items.map((item) => (
                          <Button
                            key={ item }
                            variant={ 'ghost' }
                            justifyContent={ 'space-between' }
                            onClick={ () => search(`${ section.name } ${ item }`) }
                          >
                            <Text truncate>{ item }</Text>
                            <Icon><LuChevronRight></LuChevronRight></Icon>
                          </Button>
                        ))
                      }
                    </SimpleGrid>
                  </Box>
                ))
              }
            </Stack>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
    <TabBar />
    </>
  )
}
