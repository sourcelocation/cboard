import { Affix, Button, Typography, Form, Input, Divider, Cascader } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllTeachers, deleteTeacher, teacherUpdated } from "../teachers/teachersSlice";
import { DeleteOutlined } from '@ant-design/icons';
import { useEditorDeleteTeacherMutation, useEditorUpdateTeachersMutation, useGetEditorDataQuery } from "../../api/apiSlice";
import { useParams } from "react-router-dom";
import { BiPencil } from "react-icons/bi";

const { Title } = Typography;

export const ConfigureTeachers = ({ changeTab }) => {
  const params = useParams();
  const projectId = params.id

  const [updateTeachers, updateTeachersResult] = useEditorUpdateTeachersMutation({
    fixedCacheKey: 'editor-update-teachers',
  })
  const { lessons, teachers } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      lessons: data ? data.lessons.entities : null,
      teachers: data ? data.teachers.entities : null,
    }),
  })
  const lessonsCascaderOptions = [...Object.values(lessons)].map(lessons => { return { label: lessons.name, value: lessons.id } })

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [madeChanges, setmadeChanges] = useState(false);

  const onValuesChange = (values) => {
    setmadeChanges(true)
  }
  const onFinish = (values) => {
    console.log(values);
    setmadeChanges(false)
    let patches = {}
    for (const tId in values) {
      const t = values[tId]
      patches[tId] = { name: t.name, taughtLessons: t.taughtLessons.map(id1 => ({id: id1[0]})) }
    }
    updateTeachers({ patches: patches })
  }
  // const add = () => {

  // }
  const setupLessons = () => {
    form.validateFields().then(values => {
      console.log(values);
      changeTab('1')
    })
  }
  const deleteButtonClicked = (id) => {
    dispatch(deleteTeacher(id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Title level={3}>Учителя</Title>
      <Form
        id="configureTeachersForm"
        layout='vertical'
        form={form}
        onValuesChange={onValuesChange}
        autoComplete="off"
        style={{ width: '40vw' }}
        requiredMark={false}
        onFinish={onFinish}
      >
        {teachers && Object.values(teachers).map(t => {
          return <TeacherConfig teacher={t} lessonsCascaderOptions={lessonsCascaderOptions} />
        })}
        {/* <Form.Item>
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Новый учитель
          </Button>
        </Form.Item> */}
        <Form.Item>
          <Affix offsetBottom={10} style={{ alignSelf: 'end' }}>
            <div style={{ backgroundColor: '#ffffff', border: '#f0f0f0 solid 1pt', borderRadius: '6pt' }}>
              <Button form="configureTeachersForm" type={madeChanges ? 'primary' : 'default'} disabled={madeChanges ? false : true} style={{ margin: '10pt' }} htmlType="submit">Сохранить</Button>
            </div>
          </Affix>
        </Form.Item>
      </Form>
    </div>
  )
}

const TeacherConfig = ({ teacher, lessonsCascaderOptions }) => {
  const [deleteTeacher, deleteTeacherResult] = useEditorDeleteTeacherMutation({
    fixedCacheKey: 'editor-delete-teacher',
  })

  return (
    <Form.Item>
      <Divider orientation="left">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item
            name={[teacher.id, 'name']}
            style={{ alignItems: 'center', marginBottom: '0' }}
            initialValue={teacher.name}
            rules={[{ required: true, message: 'Название урока не может быть пустым.' }]}
          >
            <Input
              size='middle'
              suffix={<BiPencil />}
              style={{ width: '150pt' }}
            />
          </Form.Item>
          <Button danger type="text" onClick={() => deleteTeacher({teacherId: teacher.id})} icon={<DeleteOutlined />} />
        </div>
      </Divider>
      <Form.Item name={[teacher.id, 'taughtLessons']} label={`Преподаваемые предметы`} initialValue={teacher.taughtLessons.map(t => [t.id])}>
        <Cascader
          options={lessonsCascaderOptions}
          multiple
          maxTagCount="responsive"
        />
      </Form.Item>
    </Form.Item>
  )
}