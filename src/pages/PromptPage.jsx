import { Card, Container, Grid, GridItem, Input, InputGroup, Stack } from '@chakra-ui/react'

export const PromptPage = () => {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna sit amet mi venenatis interdum a vel felis.'

  return (
    <Container maxWidth={ 'xl' } paddingY={ 4 }>
      <Grid templateRows={ '1fr auto' } gap={ '4' } height={ '100vh' }>
        <GridItem>
          <Stack gap={ '4' }>
            <Card.Root>
              <Card.Body>{ text }</Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body>{ text }</Card.Body>
            </Card.Root>
            <Card.Root>
              <Card.Body>{ text }</Card.Body>
            </Card.Root>
          </Stack>
        </GridItem>
        <GridItem>
          <InputGroup>
            <Input
              rounded={ 'full' }
              placeholder={ '무엇을 도와드릴까요' }
            ></Input>
          </InputGroup>
        </GridItem>
      </Grid>
    </Container>
  )
}