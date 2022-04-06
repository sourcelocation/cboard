import { IoDocumentTextOutline } from 'react-icons/io5'
import { BiBook } from 'react-icons/bi'
import { Link, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { ConfigureLessons } from './ConfigureLessons';
import { ConfigureTeachers } from './ConfigureTeachers';

export function ConfigureEditor({ }) {
  const params = useParams();
  const projectId = params.id
  const [selectedMenu, setselectedMenu] = useState('1');
  const handleMenuClick = event => {
    const value = event.key
    setselectedMenu(value)
  }
  const changeTab = (page) => {
    setselectedMenu(page)
  }
  return (
    <Layout hasSider style={{ backgroundColor: 'white' }}>
      <Sider width={256} className="site-layout-background" style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: '54pt',
        bottom: 0,
      }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
          activeKey={selectedMenu}
          onChange={(n) => setselectedMenu(n)}
        >
          <Breadcrumb style={{ padding: '16pt 16pt 10pt 16pt' }}>
            <Breadcrumb.Item>
              <Link to={`/editor/${projectId}`}>Редактор</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a>Параметры</a>
            </Breadcrumb.Item>
          </Breadcrumb>
          {/* <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1"> */}
          <Menu.Item icon={<BiBook />} key={'1'} onClick={handleMenuClick}>Предметы</Menu.Item>
          <Menu.Item icon={<UserOutlined />} key={'2'} onClick={handleMenuClick}>Учителя</Menu.Item>
          <Menu.Item icon={<IoDocumentTextOutline />} key={'3'} onClick={handleMenuClick}>Excel</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: '0 24px 24px', marginLeft: 256, backgroundColor: 'white', }}>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
          }}
        >
          {(selectedMenu == '1' && <ConfigureLessons changeTab={changeTab} />)}
          {(selectedMenu == '2' && <ConfigureTeachers changeTab={changeTab} />)}
        </Content>
      </Layout>
    </Layout>
  )
}