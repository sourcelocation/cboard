import { ActionIcon, Divider, Loader, SimpleGrid, Title } from '@mantine/core';
import { Link } from "react-router-dom";
import { useAddProjectMutation, useOrganizationQuery } from '../api/apiSlice'
import { Plus } from 'tabler-icons-react';

function ProjectItem(props) {
  const project = props.project
  return <div style={{ borderRadius: '8pt', backgroundColor: 'rgb(112 121 255)', height: '100pt' }}>
    <h2 style={{ fontWeight: 'bold', textAlign: 'start', padding: '10pt', color: 'white' }}>{project.name}</h2>
  </div>
}

export default function DashboardPage() {
  const { data: organization } = useOrganizationQuery();
  const [addProject, addProjectResult] = useAddProjectMutation()

  return (
    <div style={{ margin: '8px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
      <Title order={2}>Projects</Title>
        {/* <Button radius={100000} compact style={{ margin: '-8pt 0 0 8pt', width: '24px', height: '24px' }} onClick={() => {
          addProject({ name: "New Project " + nanoid()[0] })
        }}>+</Button> */}
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
            <Link to={`/editor/${p.id}`}>
              <ProjectItem project={p} />
            </Link>
          )}
        </SimpleGrid>

        ) : (
          <Loader />
        )
      }
    </div>
  );
}