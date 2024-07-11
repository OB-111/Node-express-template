


import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useCartLineTarget,
  Button,
  ChoiceList,
  Choice,
  BlockStack,
  Text,
  List,
  ListItem,
  useCartLines,
  InlineStack,
  useOrder,
  useCustomer
} from '@shopify/ui-extensions-react/checkout';
import {useEffect, useState} from 'react';
export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const {query} = useApi();
  const productsArray = useCartLines();
  const customer = useCustomer();

  useEffect(() => {
    if (productsArray.length > 0) {
      query(
        `query ($first: Int!) {
          products(first: $first) {
            nodes {
              id
              title
            }
          }
        }`,
        {
          variables: {first: productsArray.length},
        },
      )
        .then(({data, errors}) => {
          if (errors) {
            setError(errors);
            console.error(errors);
          } else {
            setData(data);
          }
        })
        .catch(error => {
          setError(error);
          console.error(error);
        });
    }
  }, [query, productsArray.length]);

  // console.log("Fetched Data: ", data);
  // console.log("Products Array: ", productsArray);
  // console.log("Customer: ", customer);

  const handleSaveCart = () => {

    const customerId = customer?.id;
    if (!customerId) {
      console.log('Customer not logged in');
      return;
    }    
    // const cartData = data.products.map(item => item.variant.id);
    const cartDatailsids = data.products.nodes.map(node => node.id.split('/').pop());

    console.log(customerId,cartDatailsids);

    fetch('https://home-assignment-73.myshopify.com/apps/out/api/save-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ customerId, cartDatailsids }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Cart saved successfully');
        } else {
          console.log('Failed to save cart');
        }
      })
      .catch(error => {
        console.error('Error saving cart:', error);
        console.log('Error saving cart');
      });
  //    axios.post('https://home-assignment-73.myshopify.com/apps/out/api/save-cart', {
  //   customerId,
  //   cartDatailsids
  // }, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //   }
  // })
  // .then(response => {
  //   if (response.data.success) {
  //     console.log('Cart saved successfully');
  //   } else {
  //     console.log('Failed to save cart');
  //   }
  // })
  // .catch(error => {
  //   console.error('Error saving cart:', error);
  //   console.log('Error saving cart');
  // });
  };

  if (error) {
    return <Banner status="critical">Error fetching products: {error.message}</Banner>;
  }

  if (!data) {
    return <Banner>Loading...</Banner>;
  }

  return (
    <InlineStack>
      <ChoiceList
        name="choiceMultiple"
        value={['multipleFirst']}
        onChange={(value) => {
          console.log(`onChange event with value: ${value}`);
        }}
      >
        <BlockStack>
          {data?.products?.nodes.map((node) => (
            <Choice key={node.id} id={node.id}>
              {node.title}
            </Choice>
          ))}
        </BlockStack>
      </ChoiceList>
      <Button onPress = {handleSaveCart}>Save Cart</Button>
    </InlineStack>
  );
}












