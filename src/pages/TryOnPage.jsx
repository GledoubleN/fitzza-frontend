import { Button, Grid, Stack, Image, GridItem } from '@chakra-ui/react'
import { PageLayout } from '../components/PageLayout.jsx'
import { AppBar } from '../components/AppBar.jsx'
import exampleResultImage from '/src/assets/hero.png'
import examplePersonImage from '/src/assets/react.svg'
import exampleClotheImage from '/src/assets/vite.svg'

export const TryOnPage = () => {
  return (
    <PageLayout>
      <Grid templateRows={ 'auto 2fr 1fr auto' } gap={ '4' }>
        <GridItem>
          <AppBar></AppBar>
        </GridItem>
        <GridItem>
          <Image src={ exampleResultImage }></Image>
        </GridItem>
        <GridItem>
          <Stack direction={ 'row' }>
            <Image src={ examplePersonImage }></Image>
            <Image src={ exampleClotheImage }></Image>
          </Stack>
        </GridItem>
        <GridItem>
          <Button width={ '100%' }>입어보기</Button>
        </GridItem>
      </Grid>
    </PageLayout>
  )
}