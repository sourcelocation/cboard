import React, { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { FirstLessonCreator, SecondLessonCreator, ThirdCreator } from './CreateLesson';
import { useParams } from 'react-router-dom';
import { useGetEditorDataQuery } from '../../api/apiSlice';

export const FirstTeacherCreator = ({ result }) => {
  const formRef = React.createRef();

  return (
    <Form id="createTeacherForm1" ref={formRef} name="basic" onFinish={() => {
      const values = formRef.current.getFieldsValue()
      values.id = nanoid()
      result({ teacher: values })
    }}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
      requiredMark='optional'
      layout='vertical'
      style={{ minWidth: '200pt' }}
    >
      <Form.Item label="Имя" name="name" rules={[{ required: true, message: 'Пожалуйста введите имя преподавателя' }]} >
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item>
        <Button form="createTeacherForm1" type="primary" htmlType="submit" style={{ margin: '10pt' }}>
          Далее
        </Button>
      </Form.Item>
    </Form>
  );
};

export const SecondTeacherCreator = (props) => {
  const { result, addLessonButtonClicked, passedLesson, projectId } = props
  const formRef = React.createRef();
  const { lessons } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      lessons: data ? data.lessons.entities : [],
    }),
  })

  function onChange(value) {
    console.log(lessons, passedLesson, value);
  }

  return (
    <Form id="createTeacherForm2" ref={formRef} name="basic" onFinish={() => {
      const values = formRef.current.getFieldsValue()
      const lessonIds = values.taughtLessons.map(l => l[0])
      result({ teacher: { taughtLessons: lessonIds.map(i => { return { id: i } }) } })
    }}
      autoComplete="off"
      requiredMark='optional'
      layout='vertical'
      style={{ minWidth: '200pt' }}
      initialValues={passedLesson ? { taughtLessons: [[passedLesson.id]] } : {}}
    >
      <Form.Item label="Предметы преподаваемые этим учителем" name="taughtLessons" rules={[{ required: false, message: 'Пожалуйста выберите предметы' }]}>
        <Cascader
          style={{ minWidth: '400pt' }}
          options={(passedLesson ? [...Object.values(lessons), passedLesson] : [...Object.values(lessons)]).map(lesson => { return { label: lesson.name, value: lesson.id } })}
          onChange={onChange}
          multiple
          maxTagCount="responsive"
        />
      </Form.Item>

      {!passedLesson && <h4>или</h4>}

      {!passedLesson && <Button type="default" style={{ margin: '10pt', marginBottom: '20pt' }} onClick={() => {
        const values = formRef.current.getFieldsValue()
        addLessonButtonClicked(values)
      }}>
        Добавить новый предмет
      </Button>}

      <Form.Item>
        <Button form="createTeacherForm2" type="primary" htmlType="submit" style={{ margin: '10pt' }}>
          Далее
        </Button>
      </Form.Item>
    </Form>
  );
};

export function CreateTeacher() {
  const params = useParams();
  const [page, setPage] = useState(0)
  const [data, setdata] = useState({})
  const [creatingLesson, setcreatingLesson] = useState(false)

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
  const addLessonButtonClicked = (result) => {
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
    setcreatingLesson(true)
    setPage(page + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ marginTop: '20pt' }}>Добавить учителя</h1>
      <div style={{ margin: '20pt 0', width: '75%' }}>
        <Steps size="small" current={page}>
          <Step title={!creatingLesson ? "Детали" : "Детали учителя"} />
          <Step title="Предметы" />
          {creatingLesson && <Step title="Детали предмета" />}
          {creatingLesson && <Step title="Учителя" />}
          <Step title="Готово" />
        </Steps>
      </div>
      {page == 0 && (
        <FirstTeacherCreator result={handleResult} projectId={params.id} />
      )}
      {page == 1 && (
        <SecondTeacherCreator result={handleResult} addLessonButtonClicked={addLessonButtonClicked} projectId={params.id} />
      )}
      {((page == 2 && !creatingLesson) || page == 4 && creatingLesson) && (
        <ThirdCreator data={data} projectId={params.id} />
      )}

      {(page == 2 && creatingLesson) && (
        <FirstLessonCreator result={handleResult} projectId={params.id} />
      )}
      {(page == 3 && creatingLesson) && (
        <SecondLessonCreator result={handleResult} passedTeacher={data.teacher} projectId={params.id} />
      )}
    </div>
  )
}