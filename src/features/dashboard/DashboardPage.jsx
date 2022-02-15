import { Button, Input, Form, Row, Col, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAddProjectMutation, useLoginMutation, useOrganizationQuery } from '../api/apiSlice'
import { Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa'
import { colors } from "../editor/lessons/colors";
import { nanoid } from "@reduxjs/toolkit";

function ProjectItem(props) {
  const project = props.project
  return <div style={{ borderRadius: '8pt', backgroundColor: '#1890ff', height: '100pt' }}>
    <h2 style={{ fontWeight: 'bold', textAlign: 'start', padding: '10pt', color: 'white' }}>{project.name}</h2>
  </div>
}

export default function DashboardPage() {
  const { data: organization } = useOrganizationQuery();
  const [addProject, addProjectResult] = useAddProjectMutation()

  return (
    <div style={{ margin: '32pt' }}>
      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        <h1 style={{ textAlign: 'start', fontWeight: 'bold' }}>Проекты</h1>
        <Button type="primary" shape="circle" icon={<FaPlus style={{marginBottom: '-1.15pt'}}/>} size='small' style={{margin: '-8pt 0 0 8pt' }} onClick={() =>{
          addProject({ name: "Новый проект " + nanoid()[0]})
        }}/>
      </div>
      <Divider plain style={{marginTop: '0', borderColor: "#d9d9d9"}}/>
      {organization ?
        (<Row gutter={[32, 32]}>
          {organization.projects.map(p =>
            <Col span={6}>
              <Link to={`/editor/${p.id}`}>
                <ProjectItem project={p} />
              </Link>
            </Col>
          )}
        </Row>) : (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        )
      }
    </div>
  );
}