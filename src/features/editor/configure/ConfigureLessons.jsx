import { Cascader, Divider, Button, Input, Form, Affix, Typography } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteCopyableLesson, lessonUpdated, selectAllLessons } from '../lessons/lessonsSlice';
import { selectAllTeachers, selectTeachersByLesson, taughtLessonAddedForIds } from '../teachers/teachersSlice';
import { MdCircle } from 'react-icons/md'
import { useDispatch } from 'react-redux';
import { BiPencil } from 'react-icons/bi';
import { copyableLessonDeleted } from '../lessons/lessonsSlice'
import { DeleteOutlined } from '@ant-design/icons';
import { colors } from '../lessons/colors'
import { useEditorDeleteLessonMutation, useEditorUpdateLessonsMutation, useGetEditorDataQuery } from '../../api/apiSlice';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

export const ConfigureLessons = ({ }) => {
  const params = useParams();
  const projectId = params.id

  const [updateLessons, updateLessonsResult] = useEditorUpdateLessonsMutation({
    fixedCacheKey: 'editor-update-lessons',
  })

  const { lessons } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      lessons: data ? data.lessons.entities : [],
    }),
  })
  // const lessons = useSelector(state => selectAllLessons(state))
  // const teachers = useSelector(state => selectAllTeachers(state))
  // const teachersArray = Object.values(teachers)
  // const teachersOptions = [...teachersArray].map(teacher => { return { label: teacher.name, value: teacher.id } })
  const [form] = Form.useForm();
  const [madeChanges, setmadeChanges] = useState(false);

  const onValuesChange = (values) => {
    setmadeChanges(true)
  }
  const onFinish = (values) => {
    // console.log(values);
    // setmadeChanges(false)
    // for (const lessonId in values) {
    //   const lessonData = values[lessonId];
    //   const newName = lessonData.name
    //   // dispatch(lessonUpdated({ id: lessonId, changes: { name: newName } }))

    //   const teacherIds = lessonData.teachers.map(i => i[0])
    //   // dispatch(taughtLessonAddedForIds({ lessonId: lessonId, teacherIds: teacherIds, set: true }))
    // }
    console.log(values);
    setmadeChanges(false)
    let patches = {}
    for (const lId in values) {
      const l = values[lId]
      patches[lId] = { name: l.name }
    }
    updateLessons({ patches: patches })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      {/* <Prompt
        when={madeChanges}
        message='You have unsaved changes, are you sure you want to leave?'
      /> */}
      <Title level={3}>Предметы</Title>
      <Form
        id="configureLessonsForm"
        layout='vertical'
        form={form}
        onValuesChange={onValuesChange}
        autoComplete="off"
        style={{ width: '40vw' }}
        requiredMark={false}
        onFinish={onFinish}
      >
        {Object.values(lessons).map(l => {
          // const teachersForL = teachersArray.filter(t => t.taughtLessons.map(l1 => l1.id).includes(l.id))
          return <LessonConfig lesson={l} />
        })}
        <Form.Item>
          <Affix offsetBottom={4} style={{ alignSelf: 'end' }}>
            <div style={{ backgroundColor: '#ffffff', border: '#f0f0f0 solid 1pt', borderRadius: '6pt' }}>
              <Button form="configureLessonsForm" type={madeChanges ? 'primary' : 'default'} disabled={madeChanges ? false : true} style={{ margin: '10pt' }} htmlType="submit">Сохранить</Button>
            </div>
          </Affix>
        </Form.Item>
      </Form>

    </div>
  )
}
const LessonConfig = ({ lesson }) => {
  const [deleteLesson, deleteLessonResult] = useEditorDeleteLessonMutation({
    fixedCacheKey: 'editor-delete-lesson',
  })

  return (
    <Form.Item>
      <Divider orientation="left">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MdCircle style={{ marginRight: '4pt', color: colors[lesson.color] ? colors[lesson.color][0] : lesson.color }} />
          <Form.Item
            name={[lesson.id, 'name']}
            style={{ alignItems: 'center', marginBottom: '0' }}
            initialValue={lesson.name}
            rules={[{ required: true, message: 'Название урока не может быть пустым.' }]}
          >
            <Input
              size='middle'
              suffix={<BiPencil />}
              style={{ width: '150pt' }}
            />
          </Form.Item>
          <Button danger type="text" onClick={() => deleteLesson({ lessonId: lesson.id })} icon={<DeleteOutlined />} />
        </div>
      </Divider>

    </Form.Item>
  )
}