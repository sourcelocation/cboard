import { Group, Button } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useState } from 'react';
import { authHeader } from '../../../services/auth-header'
import { Check } from 'tabler-icons-react'

export const ExcelGenerateButton = ({ projectId }) => {
  const [generatedUrl, setgeneratedUrl] = useState(false)

  async function generate() {
    showNotification({
      id: 'excel-gen',
      loading: true,
      title: 'Generating .xlsx file',
      message: 'The file will be generated in a few seconds, please wait',
      autoClose: false,
      disallowClose: true,
    });
    const url = `http://127.0.0.1:8080/project/${projectId}/generateExcel`
    const token = localStorage.getItem('user-token')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    setgeneratedUrl(response.JSON().url)
    updateNotification({
      id: 'excel-gen',
      color: 'primary',
      title: 'Successfully generated!',
      message: 'The download will now start',
      icon: <Check />,
      autoClose: 2000,
    });
  }

  return (
    <Button variant="light" onClick={generate}>
      Generate Excel
    </Button>
  )
}