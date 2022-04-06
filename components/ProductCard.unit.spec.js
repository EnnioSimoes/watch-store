import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import { makeServer } from '@/miragejs/server'

let server
const mountProductCard = () => {
  const product = server.create('product', {
    title: 'Relogio Maroto',
    price: '22.00',
    image:
      'https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
  })

  return {
    wrapper: mount(ProductCard, {
      propsData: {
        product,
      },
    }),
    product,
  }
}

describe('ProductCard unit', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should match snapshot', () => {
    // console.log(wrapper.html())
    const { wrapper } = mountProductCard()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should mount the component', () => {
    const { wrapper } = mountProductCard()

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relogio Maroto')
    expect(wrapper.text()).toContain('$22.00')
  })

  it('should emit the event addToCart with product object object when button gets clicked', async () => {
    const { wrapper, product } = mountProductCard()

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted().addToCart).toBeTruthy()
    expect(wrapper.emitted().addToCart.length).toBe(1)
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }])
  })
})
