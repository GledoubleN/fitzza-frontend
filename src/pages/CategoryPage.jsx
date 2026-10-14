import { useEffect, useState } from 'react'
import { Box, Button, Container, Grid, GridItem, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { LuChevronRight } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { api } from '../api/axios.js'

export const CategoryPage = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCode, setSelectedCode] = useState(null)
  const selected = categories.find((category) => category.code === selectedCode)
    ?? categories[0]
  // 중분류에 소분류가 있으면 중분류별로 묶고, 없으면 중분류를 바로 나열합니다.
  const sections = selected?.children.some((child) => child.children.length)
    ? selected.children
    : selected ? [selected] : []

  const search = (code) => navigate(
    `/search?${ new URLSearchParams({ category: code }) }`)

  useEffect(() => {
    api.get('/categories')
    .then((response) => setCategories(response.data))
    .catch((error) => console.log(error))
  }, [])

  return (
    <>
      <Stack
        paddingY={ '4' }
        height={ '100vh' }
        gap={ '4' }
      >
        <AppBar></AppBar>
        <Container maxWidth={ '3xl' } flex={ '1' } minHeight={ '0' }>
          <Stack height={ 'full' } gap={ '4' }>
            <Heading size={ 'xl' }>카테고리</Heading>
            <Grid
              templateColumns={ '1fr 4fr' }
              gap={ '4' }
              minHeight={ '0' }
            >
              <GridItem overflowY={ 'auto' }>
                <Stack gap={ '4' }>
                  {
                    categories.map((category) => (
                      <Button
                        key={ category.code }
                        variant={ selected?.code === category.code
                          ? 'subtle'
                          : 'ghost' }
                        justifyContent={ 'flex-start' }
                        onClick={ () => setSelectedCode(category.code) }
                      >
                        { category.name }
                      </Button>
                    ))
                  }
                </Stack>
              </GridItem>
              <GridItem overflowY={ 'auto' }>
                <Stack gap={ '4' }>
                  { sections.map((section) => (
                    <Stack key={ section.code } gap={ '4' }>
                      <Button
                        variant={ 'ghost' }
                        width={ 'full' }
                        justifyContent={ 'space-between' }
                        onClick={ () => search(section.code) }
                      >
                        <Heading size={ 'md' }>{ section.name }</Heading>
                        <Icon><LuChevronRight></LuChevronRight></Icon>
                      </Button>
                      {/* 칸 최소 140px, 최대 3열: 칸 폭을 max(140px, 1/3)로 잡아 4열 이상 생기지 않게 하였습니다. */ }
                      {/* spacing.1 === gap={ 1 } */ }
                      {/* gap의 너비만큼 spacing 값도 같이 변경해주어야 합니다.*/ }
                      {/* 예를 들어 gap이 4라면 spacing.4를 사용해야 합니다.*/ }
                      <SimpleGrid
                        templateColumns={ 'repeat(auto-fill, minmax(max(140px, calc((100% - 2 * {spacing.4})/3)), 1fr))' }
                        gap={ '4' }
                      >
                        {
                          section.children.map((item) => (
                            <Button
                              key={ item.code }
                              variant={ 'ghost' }
                              justifyContent={ 'space-between' }
                              onClick={ () => search(item.code) }
                            >
                              <Text truncate>{ item.name }</Text>
                              <Icon><LuChevronRight></LuChevronRight></Icon>
                            </Button>
                          ))
                        }
                      </SimpleGrid>
                    </Stack>
                  )) }
                </Stack>
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Stack>
      <TabBar/>
    </>
  )
}
