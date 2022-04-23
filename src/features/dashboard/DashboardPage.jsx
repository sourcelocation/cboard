import { ActionIcon, Divider, Loader, SimpleGrid, Space, Title } from '@mantine/core';
import { Link } from "react-router-dom";
import { useAddProjectMutation, useOrganizationQuery } from '../api/apiSlice'
import { Plus } from 'tabler-icons-react';

function ProjectItem(props) {
  const project = props.project
  return <Link to={`/editor/${project.id}`} style={{textDecoration: 'none'}}>
    <div style={{ borderRadius: '8pt', backgroundColor: 'white', height: '100pt' }}>
      <h3 style={{ fontWeight: 'bold', textAlign: 'start', padding: '10pt', color: 'black' }}>{project.name}</h3>
    </div>
  </Link>
}

export default function DashboardPage() {
  const { data: organization } = useOrganizationQuery();
  const [addProject, addProjectResult] = useAddProjectMutation()

  return (
    <div style={{ padding: '8px 40px', height: 'calc(100vh)', backgroundColor: '#F7F7F7' }}>
      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        <Title order={2}>Projects</Title>
        <Space w="md" />
        <ActionIcon variant="filled" color="primary" size="sm">
          <Plus size={16} />
        </ActionIcon>
      </div>
      <Divider my="sm" />
      {organization ?
        (<SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {organization.projects.map(p =>
            <ProjectItem project={p} />
          )}
        </SimpleGrid>

        ) : (
          <Loader />
        )
      }
    </div>
  );
}