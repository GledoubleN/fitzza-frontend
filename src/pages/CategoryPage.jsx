import { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react'
import { LuChevronRight } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { api } from '../api/axios.js'

export const CategoryPage = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState(null)

  async function loadCategories () {
    try {
      const response = await api.get('/categories')
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      if (response.data?.length === 0) {
        return
      }

      setCategories(response.data)
      setSelected(response.data[0])

    } catch (error) {
      console.log('카테고리 불러오기 실패:', error)
    }
  }

  useEffect(() => {
    api.get('/categories')
    .then((response) => setCategories(response.data))
    .catch((error) => console.log(error))
  }, [])

  const childrenItems = selected ? (selected.children ?? []) : []

  const searchByCategory = (categoryCode) => {
    navigate(`/search?${ new URLSearchParams({ category: categoryCode }) }`)
  }

  return (
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
                      onClick={ () => setSelected(category) }
                    >
                      { category.name }
                    </Button>
                  ))
                }
              </Stack>
            </GridItem>

            <GridItem overflowY={ 'auto' }>
              <Stack gap={ '4' }>
                <SimpleGrid
                  templateColumns={ '1fr 1fr' }
                  gap={ '3' }
                >
                  {
                    childrenItems.map((child) => (
                      <Button
                        key={ child.code }
                        variant={ 'ghost' }
                        justifyContent={ 'space-between' }
                        onClick={ () => searchByCategory(child.code) }
                      >
                        <Text truncate>{ child.name }</Text>
                        <Icon><LuChevronRight/></Icon>
                      </Button>
                    ))
                  }
                </SimpleGrid>
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </Container>

      <TabBar/>
    </Stack>
  )
}