import { Button, Steps, message, Form, Input, Cascader, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { CirclePicker } from 'react-color';
import { Link, useParams } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { FirstTeacherCreator, SecondTeacherCreator } from './CreateTeacher';
import { colors } from '../lessons/colors'
import { useEditorAddLessonMutation, useEditorAddTeacherMutation, useEditorCombinedActionsMutation, useEditorMultipleActionsMutation, useGetEditorDataQuery } from '../../api/apiSlice';

const { Step } = Steps;

export const FirstLessonCreator = (props) => {
  const { result } = props
  const formRef = React.createRef();
  const [selectedColor, setselectedColor] = useState({ hex: '#FFFFFF' })

  return (
    <Form id="createLessonForm1" ref={formRef} name="basic" onFinish={() => {
      const values = formRef.current.getFieldsValue()
      const colorHex = values.color.hex
      const color = Object.keys(colors).find(key => colors[key][0].toLowerCase() === colorHex.toLowerCase());
      values.color = color
      values.id = nanoid()
      result({ lesson: values })
    }}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark='optional'
      layout='vertical'
      style={{ minWidth: '200pt' }}
    >
      <Form.Item label="Название" name="name" rules={[{ required: true, message: 'Пожалуйста введите название предмета' }]} >
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item label="Цвет" name="color" rules={[{ required: true, message: 'Пожалуйста выберите цвет' }]} >
        <CirclePicker color={selectedColor} onChangeComplete={(color) => {
          setselectedColor(color);
        }} colors={Object.values(colors).map(color => color[0])} />
      </Form.Item>

      <Form.Item>
        <Button form="createLessonForm1" type="primary" htmlType="submit" style={{ margin: '10pt' }}>
          Далее
        </Button>
      </Form.Item>
    </Form>
  );
};

export const SecondLessonCreator = (props) => {
  const { result, addTeacherButtonClicked, passedTeacher, projectId } = props

  const formRef = React.createRef();
  const { teachers } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      teachers: data ? data.teachers.entities : [],
    }),
  })

  function onChange(value) {

  }

  return (
    <Form ref={formRef} name="basic" onFinish={() => {
      const values = formRef.current.getFieldsValue()
      const teacherIds = values.teachers.map(l => l[0])
      result({ lesson: { teacherIds: teacherIds } })
    }}
      autoComplete="off"
      requiredMark='optional'
      layout='vertical'
      style={{ minWidth: '200pt' }}
      initialValues={passedTeacher ? { teachers: [[passedTeacher.id]] } : {}}
    >
      <Form.Item label="Учителя преподающие этот предмет" name="teachers" rules={[{ required: true, message: 'Пожалуйста выберите учителей' }]}>
        <Cascader
          style={{ minWidth: '400pt' }}
          // options={Object.values(teachers).map(teacher => { return { label: teacher.name, value: teacher.id } })}
          options={(passedTeacher ? [...Object.values(teachers), passedTeacher] : [...Object.values(teachers)]).map(teacher => { return { label: teacher.name, value: teacher.id } })}
          onChange={onChange}
          multiple
          maxTagCount="responsive"
        />
      </Form.Item>

      {!passedTeacher && <h4>или</h4>}

      {!passedTeacher && <Button type="default" style={{ margin: '10pt', marginBottom: '20pt' }} onClick={() => {
        const values = formRef.current.getFieldsValue()
        addTeacherButtonClicked(values)
      }}>
        Добавить нового учителя
      </Button>}

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ margin: '10pt' }}>
          Далее
        </Button>
      </Form.Item>
    </Form>
  );
};

export const ThirdCreator = ({ data, projectId }) => {
  // const dispatch = useDispatch()
  const [addLesson, addLessonResult] = useEditorAddLessonMutation()
  const [addTeacher, addTeacherResult] = useEditorAddTeacherMutation()
  const [sendActions, sendActionsResult] = useEditorMultipleActionsMutation()

  useEffect(() => {
    let actions = []

    if (data.lesson.name) {
      const lesson = data.lesson
      actions.push(JSON.stringify({ lessonId: lesson.id, name: lesson.name, color: lesson.color, teacherIds: lesson.teacherIds, addLessonAction: 'true' }))
    }
    if (data.teacher.name) {
      const teacher = data.teacher
      actions.push(JSON.stringify({ teacherId: teacher.id, name: teacher.name, taughtLessons: teacher.taughtLessons ? teacher.taughtLessons : [{id: data.lesson.id}], addTeacherAction: 'true' }))
    }
    sendActions({actions: actions})
  }, [])

  return (
    <Result
      status="success"
      title={Object.keys(data)[0] == "lesson" ? "Предмет успешно создан" : "Учитель успешно добавлен"}
      subTitle={Object.keys(data)[0] == "lesson" ? "Теперь вы сможете использовать его в редакторе" : "Теперь вы сможете использовать его уроки в редакторе"}
      extra={[
        <Link to={`/editor/${projectId}`} style={{ textDecoration: 'none' }}>
          <Button type="primary" key="editor" >
            Перейти в редактор
          </Button>
        </Link>,
        <Button key="add" onClick={() => {

        }} >Добавить еще один</Button>
      ]}
    />
  )
}

export function CreateLesson() {
  const params = useParams();
  const [page, setPage] = useState(0)
  const [data, setdata] = useState({})
  const [creatingTeacher, setcreatingTeacher] = useState(false)

  const handleResult = (result) => {
    const newdata = {
      lesson: {
        ...result.lesson,
        ...data.lesson
      },
      teacher: {
        ...result.teacher,
        ...data.teacher
      }
    }
    setdata(newdata)
    setPage(page + 1)
  }
  const addTeacherButtonClicked = (result) => {
    const newdata = {
      lesson: {
        ...result.lesson,
        ...data.lesson
      },
      teacher: {
        ...result.teacher,
        ...data.teacher
      }
    }
    setdata(newdata)
    setcreatingTeacher(true)
    setPage(page + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ marginTop: '20pt' }}>{creatingTeacher ? "Новый предмет и учитель" : "Новый предмет"}</h1>
      <div style={{ margin: '20pt 0', width: '75%' }}>
        <Steps size="small" current={page}>
          <Step title={!creatingTeacher ? "Детали" : "Детали предмета"} />
          <Step title="Учителя" />
          {creatingTeacher && <Step title="Детали учителя" />}
          {creatingTeacher && <Step title="Уроки учителя" />}
          <Step title="Готово" />
        </Steps>
      </div>
      {page == 0 && (
        <FirstLessonCreator result={handleResult} projectId={params.id} />
      )}
      {page == 1 && (
        <SecondLessonCreator result={handleResult} addTeacherButtonClicked={addTeacherButtonClicked} projectId={params.id} />
      )}
      {((page == 2 && !creatingTeacher) || page == 4 && creatingTeacher) && (
        <ThirdCreator data={data} projectId={params.id} />
      )}

      {(page == 2 && creatingTeacher) && (
        <FirstTeacherCreator result={handleResult} projectId={params.id} />
      )}
      {(page == 3 && creatingTeacher) && (
        <SecondTeacherCreator result={handleResult} passedLesson={data.lesson} projectId={params.id} />
      )}
    </div>
  )
}