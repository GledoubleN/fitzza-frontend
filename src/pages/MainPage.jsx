import {
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Card,
  Text,
  GridItem,
  Image,
  Carousel,
  Box, Center
} from "@chakra-ui/react";
import { LuBell, LuChevronLeft, LuChevronRight, LuHeart, LuShoppingBag } from "react-icons/lu";
import exampleProductImage from "/src/assets/hero.png"
import exampleBannerImage from "/src/assets/vite.svg"
import { products } from "/src/data/products.js"
import { banners } from "/src/data/banners.js"

export const MainPage = () => {

  return (
    <Container maxWidth={ "xl" } height="100vh" paddingY={ "4" }>
      <Stack direction={ "column" } gap={ "4" }>
        <Grid templateColumns={ "auto 1fr auto auto" } gap={ "4" }>
          <GridItem alignContent={ "center" }>
            <Text>Fitzza</Text>
          </GridItem>
          <GridItem></GridItem>
          <GridItem>
            <IconButton rounded={ "full" }>
              <LuBell></LuBell>
            </IconButton>
          </GridItem>
          <GridItem>
            <IconButton rounded={ "full" }>
              <LuShoppingBag></LuShoppingBag>
            </IconButton>
          </GridItem>
        </Grid>

        <Carousel.Root slideCount={ banners.length }>
          <Carousel.ItemGroup height={ "100px" }>
            {
              banners.map((_, index) => (
                <Carousel.Item key={ index } index={ index } alignContent={ "center" }>
                  <Center height={ "100%" }>
                    <Image height={ "100%" } src={ exampleBannerImage }></Image>
                  </Center>
                </Carousel.Item>
              ))
            }
          </Carousel.ItemGroup>
          <Carousel.Control justifyContent="center" gap="4">
            <Carousel.PrevTrigger asChild>
              <IconButton size="xs" variant="ghost">
                <LuChevronLeft/>
              </IconButton>
            </Carousel.PrevTrigger>

            <Carousel.Indicators/>

            <Carousel.NextTrigger asChild>
              <IconButton size="xs" variant="ghost">
                <LuChevronRight/>
              </IconButton>
            </Carousel.NextTrigger>
          </Carousel.Control>
        </Carousel.Root>

        <Grid templateColumns={ "repeat(3, 1fr)" } gap={ "4" }>
          {
            products.map((product, index) => {
              return (
                <GridItem>
                  <Card.Root>
                    <IconButton
                      position="absolute"
                      top="2"
                      right="2"
                      aria-label="Close"
                      rounded="full"
                      size="xs"
                    >
                      <LuHeart></LuHeart>
                    </IconButton>
                    <Image src={ exampleProductImage }></Image>
                    <Card.Body padding={ "2" }>
                      <Text>{ product.name }</Text>
                      <Text>{ product.price.toLocaleString() } 원</Text>
                    </Card.Body>
                  </Card.Root>
                </GridItem>
              )
            })
          }
        </Grid>
      </Stack>
    </Container>
  );
}