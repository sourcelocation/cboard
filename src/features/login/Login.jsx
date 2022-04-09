import { TextInput, Checkbox, Button, Group, Box, PasswordInput, Space } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useNavigate } from "react-router-dom";
import { useLoginMutation } from '../api/apiSlice'
import LoginSideImage from './../../images/Login-Side-Image.png'
import CboardIconSimple from '../../images/CboardIcon-Simple.png'

export default function Login() {
  let navigate = useNavigate();
  const [login, { isLoading, error, data }] = useLoginMutation();

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const result = await login(values);
      console.log(result);
      if (result.data) {
        localStorage.setItem('user-token', result.data.value)
        console.log(result.data.value);
        // Successfuly authorized
        navigate('/dashboard')
      }
    } catch (err) {
      console.log(err);
    }
  };

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <img src={CboardIconSimple} style={{ display: 'flex', width: '50px' }} />
        {/* <Space h='sm' /> */}
        <h2>Log in</h2>
        <p style={{ color: '#AAAAAA', marginTop: '-10px', marginBottom: '32px', textAlign: 'center' }}>Use your email and password to log in back into your account</p>
        <Box sx={{ minWidth: '50%' }} mx="auto">
          <form onSubmit={form.onSubmit(onFinish)} >
            <TextInput
              required
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps('email')}
              style={{ padding: '10px 0' }}
            />

            {/* <PasswordInput
              placeholder="Password"
              label="Password"
              // description="Password must include at least one letter, number and special character"
              required
            /> */}
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              style={{ padding: '10px 0' }}
              {...form.getInputProps('password')}
            />

            {/* <Checkbox
              mt="md"
              label="I agree to sell my privacy"
              {...form.getInputProps('termsOfService', { type: 'checkbox' })}
            /> */}

            <Group position="right" mt="md">
              <Button type="submit">Login</Button>
            </Group>
          </form>
        </Box>
      </div>
      <div style={{ backgroundColor: '#7F7BFF', width: '50%', display: 'flex', height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <img src={LoginSideImage} style={{ maxHeight: 'calc(100% - 0px)', maxWidth: 'calc(100% - 0px)' }} />
      </div>
    </div>
  );
}