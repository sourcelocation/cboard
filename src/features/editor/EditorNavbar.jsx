import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useOrganizationQuery, websocketConnection } from '../api/apiSlice'
import logo from './../../images/CboardFile.png'
import { LoadingOutlined } from '@ant-design/icons';
import { BsCloudCheck, BsCloudSlash, BsCloudMinus } from 'react-icons/bs'

export const EditorNavbar = () => {
  const params = useParams()
  const projectId = params.id
  const { data: organization } = useOrganizationQuery();
  const project = organization?.projects?.find(p => p.id === projectId)
  const [syncedState, setsyncedState] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setsyncedState(websocketConnection && websocketConnection.ws.readyState)
    }, 300);
    return () => {
      clearInterval(interval);
    };
  }, []);

  let syncText = "Соединение..."
  let syncIcon = <BsCloudMinus />
  if (syncedState == 1) {
    syncText = "Подключено"
    syncIcon = <BsCloudCheck />
  } else if (syncedState == 3) {
    syncText = "Соединение прервано"
    syncIcon = <BsCloudSlash />
  }

  return (
    <nav style={{ backgroundColor: '#fafafa', padding: '6pt 6pt', position: 'sticky', top: '0', border: '1px solid #f0f0f0' }}>
      <section style={{ display: 'flex', padding: '0 8pt', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to={!!localStorage.getItem('user') ? "/dashboard" : "/"} style={{ textDecoration: 'none' }}>
            <img src={logo} style={{ width: '30pt', height: '30pt' }} />
          </Link>
          {project ? <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'start', padding: '0 12pt' }}>
            <h2 style={{ margin: '0', fontSize: '15pt', width: '100%' }}>{project.name}</h2>
            <div style={{ display: 'flex', justifyContent: 'start', width: '100%', alignItems: 'center' }}>
              <p style={{ margin: '0 4pt 0 0' }}>{syncText}</p>
              {syncIcon}
            </div>
          </div>
            : <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
        </div>
      </section>
    </nav>
  )
}
