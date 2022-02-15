import { useDispatch, useSelector } from "react-redux";
import { selectAllLessons } from "./lessons/lessonsSlice";
import { Button, Divider, Input, Modal, Select, Form, InputNumber, message } from 'antd';
import { Link } from "react-router-dom";
import { selectTeachersByLesson } from "./teachers/teachersSlice";
import { selectAllClasses, studentAdded } from "./students/studentSlice";
import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { selectDays } from "./schedule/scheduleInfoSlice";
import { CopyableLessonBox } from "./lessons/box/CopyableLessonBox";
import { useEditorAddStudentMutation, useEditorCopyLessonMutation, useGetEditorDataQuery } from "../api/apiSlice";

const { Option } = Select;


export const EditorSidebar = (props) => {
  const { projectId } = props
  const { classes, avaliableLessons, teachers } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      classes: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.classNames))) : [],
      avaliableLessons: data ? Object.values(data.lessons.entities) : [],
      teachers: data ? Object.values(data.teachers.entities) : [],
    }),
  })
  const [addStudent, addStudentResult] = useEditorAddStudentMutation()

  const [modalShown, setmodalShown] = useState(false)
  const dispatch = useDispatch()
  const days = useSelector(state => selectDays(state))

  const classSelect = (
    <Form.Item name="class1" noStyle rules={[{ required: true, message: 'Пожалуйста выберите класс ученика' }]}>
      <Select>
        {classes.map(c => <Option value={c}>{c}</Option>)}
        <Option value={"new_class_option"}>Новый класс</Option>
      </Select>
    </Form.Item>
  );
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    form.resetFields()
    console.log(values);
    let class1 = values.class1 || classes[0]
    if (class1 == "new_class_option") {
      class1 = values.className
    }
    setmodalShown(false)
    addStudent({ studentId: nanoid(), name: values.name, className: class1, dayLessonCount: values.lessonCount })
  }

  return (
    <div style={{ height: 'calc(100vh - 54pt)', width: '160pt', overflowY: 'scroll', marginTop: '0pt' }} className="available-lessons-content">
      <div>

        {avaliableLessons.map((lesson) => (
          <LessonTeachers lesson={lesson} key={lesson.id} teachers={teachers} />
        ))}
        
      </div>
      <Link to={`/editor/${projectId}/configure`} >
        <Button block style={{ marginTop: '10pt', marginBottom: '-2pt' }} type='default'>
          Параметры
        </Button>
      </Link>
      <Divider style={{ marginBottom: '16pt' }} />
      <Link to={`/editor/${projectId}/newLesson`} >
        <Button block style={{ marginBottom: '8pt' }} type='dashed'>
          Добавить предмет
        </Button>
      </Link>
      <Link to={`/editor/${projectId}/newTeacher`} >
        <Button block style={{ marginBottom: '8pt' }} type='dashed'>
          Добавить учителя
        </Button>
      </Link>
      <Button block style={{ marginBottom: '8pt' }} type='dashed' onClick={() => { setmodalShown(true) }}>
        Добавить ученика
      </Button>
      <Button type='primary' block style={{ marginBottom: '8pt' }} onClick={() => {
        message.warning('В данный момент эта функция находится в разработке');
      }}>
        Экспорт в Excel
      </Button>


      <Modal
        title="Новый ученик"
        visible={modalShown}
        onCancel={() => { setmodalShown(false) }}
        footer={[
          <Button onClick={() => { setmodalShown(false) }}>
            Отмена
          </Button>,
          <Button form="newStudentForm" key="submit" htmlType="submit" type='primary'>
            Добавить
          </Button>
        ]}
      >
        <Form
          form={form}
          id="newStudentForm"
          layout='vertical'
          requiredMark={false}
          onFinish={onSubmit}
          initialValues={{ class1: [...classes, "new_class_option"][0] }}
        >
          <Form.Item label="Имя" name="name" rules={[{ required: true, message: 'Пожалуйста введите имя ученика' }]} >
            <Input autoComplete="off" addonAfter={classSelect} placeholder="Имя" />
          </Form.Item>

          <Form.Item label="Кол-во уроков в день" name="lessonCount" extra="Кол-во уроков всегда можно будет изменить для каждого дня" rules={[{ required: true, message: 'Пожалуйста введите кол-во уроков' }]} >
            <InputNumber min={1} max={50} placeholder="1" />
          </Form.Item>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) => prevValues.class1 !== currentValues.class1}
            noStyle
          >
            {({ getFieldValue }) =>
              getFieldValue('class1') === 'new_class_option' ? (
                <Form.Item name="className" label="Класс" rules={[{ required: true, message: 'Пожалуйста введите название класса' }]}>
                  <Input autoComplete="off" placeholder="Напр. 8-1" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const LessonTeachers = ({ teachers, lesson }) => {
  const filteredTeachers = teachers.filter(t => t.taughtLessons.map(l => l.id).includes(lesson.id))

  return (
    filteredTeachers.map(teacher => <div style={{ marginTop: '10pt' }}>
      <CopyableLessonBox lesson={lesson} teacher={teacher} />
    </div>
    )
  )
}