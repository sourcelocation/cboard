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
import { useForm } from '@mantine/form';
import { Loader, NumberInput } from "@mantine/core";

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
    </div>) : (
      <Loader />
    )
  )
}
const ZoomSelect = ({ setZoom }) => {
  return (
    <NumberInput min={1} max={100} addonAfter="%" defaultValue={100} size='small' onChange={setZoom} style={{ width: '80px' }} controls={false} />
  )
}