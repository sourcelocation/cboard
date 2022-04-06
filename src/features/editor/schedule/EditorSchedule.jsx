import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useDragDropManager, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { getPlacements } from "../lessons/logic";
import { dayAdded, lessonDeleted, transformStudentsToScheduleData } from "../students/studentSlice";
import { addDay } from "./scheduleInfoSlice";
import { AutoSizer } from 'react-virtualized'
import { RenderGrid } from "./EditorGrid";
import { ItemTypes } from "../Editor";
import { useGetEditorDataQuery } from "../../api/apiSlice";

export default function EditorSchedule(props) {
  const dragDropManager = useDragDropManager()
  const monitor = dragDropManager.getMonitor();
  const projectId = props.projectId

  const { scheduleData, students, classNames, teachers, lessons } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      scheduleData: data ? transformStudentsToScheduleData(Object.values(data.students.entities)) : [[], [], [], [], []],

      students: data ? data.students.entities : [],
      teachers: data ? data.teachers.entities : [],
      lessons: data ? data.lessons.entities : [],

      classNames: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.className))) : [],
    }),
  })

  const [allowedFields, setallowedFields] = useState(null)
  const [zoom, setZoom] = useState(100)

  const [modalShown, setmodalShown] = useState(false)
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const [{ }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return
      }
      const { lessonId, teacherId, i } = monitor.getItem()

      if (i) {
        dispatch(lessonDeleted({ ...i }))
      }
    }
  }))

  const onSubmit = (values) => {
    form.resetFields()
    console.log(values);
    dispatch(dayAdded())
    dispatch(addDay(values.name))
    setmodalShown(false)
  }

  const onZoomChange = (v) => {
    console.log(v);
  }
  const onPanChange = (v) => {
    console.log(v);
  }

  useEffect(() => monitor.subscribeToStateChange(() => {
    if (scheduleData) {
      const item = monitor.getItem()

      if (item && !allowedFields) {
        const i = item.i
        const modified = cloneDeep(scheduleData)
        if (i) {
          modified[i.dayI][i.classI].students[i.studentId][i.lessonI] = null
        }
        const res = getPlacements(item, modified)
        setallowedFields(res)
      } else if (!item) {
        setallowedFields(null)
      }
    }
  }), [scheduleData, allowedFields])

  return (
    !!scheduleData ? (<div style={{ width: 'calc(100% - 160pt)', }} ref={drop}>
      <section style={{ display: 'flex', padding: '6pt 8pt', alignItems: 'center', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ZoomSelect setZoom={setZoom} />
        </div>
      </section>
      <AutoSizer>
        {({ height, width }) => (
          <RenderGrid
            {...props}
            allowedFields={allowedFields}
            classNames={classNames}
            data={scheduleData}
            height={height}
            lessons={lessons}
            students={students}
            teachers={teachers}
            width={width}
            zoom={zoom}
          />
        )}
      </AutoSizer>
      <Modal
        title="Добавить день"
        visible={modalShown}
        onCancel={() => { setmodalShown(false) }}
        footer={[
          <Button onClick={() => { setmodalShown(false) }}>
            Отмена
          </Button>,
          <Button form="createDayForm" key="submit" htmlType="submit" type='primary'>
            Добавить
          </Button>
        ]}
      >
        <Form id="createDayForm" form={form} requiredMark={false} onFinish={onSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]} >
            <Input autoComplete="off" placeholder="Напр. Суббота" />
          </Form.Item>
        </Form>
      </Modal>
    </div>) : (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    )
  )
}
const ZoomSelect = ({setZoom}) => {
  return (
    // <Input a size='small' style={{width: '150px'}}/>
    <InputNumber min={1} max={100} addonAfter="%" defaultValue={100} size='small' onChange={setZoom} style={{width: '80px'}} controls={false} />
  )
}