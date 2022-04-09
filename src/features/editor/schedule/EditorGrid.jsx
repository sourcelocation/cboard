import React, { useEffect } from 'react';
import { CellMeasurer, CellMeasurerCache, Grid } from 'react-virtualized';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lessonFieldAdded, lessonFieldDeleted, lessonSet, selectAllClasses, selectLessonByI, studentDeleted, studentDetailsChanged } from "../students/studentSlice";
import { BiPencil } from 'react-icons/bi';
import { selectDays } from './scheduleInfoSlice';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../Editor';
import { applyZoom, DraggableLessonBox } from '../lessons/box/DraggableLessonBox';
import { useEditorCopyLessonMutation, useEditorDeleteStudentMutation, useEditorLessonFieldCountMutation, useEditorMoveLessonMutation, useEditorUpdateStudentMutation, useGetEditorDataQuery } from '../../api/apiSlice';
import { EditStudentButton } from './student/StudentEditButton';
import { Group } from '@mantine/core';

const cache = new CellMeasurerCache({
  defaultWidth: 1000,
  minWidth: 20,
  defaultHeight: 1000,
  minHeight: 20,
});

export class RenderGrid extends React.Component {
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
  }

  recompute({ columnIndex, rowIndex }) {
    this.gridRef.recomputeGridSize({ columnIndex: columnIndex, rowIndex: rowIndex })
  }

  render() {
    return (
      <Grid
        ref={(grid) => {
          this.gridRef = grid;
        }}
        height={this.props.height}
        width={this.props.width}
        columnCount={this.props.data[0].length}
        rowCount={this.props.data.length}
        columnWidth={cache.columnWidth}
        rowHeight={cache.rowHeight}
        deferredMeasurementCache={cache}
        cellRenderer={(values) => cellRenderer({
          ...this.props,
          ...values,
          content: this.props.data[values.rowIndex][values.columnIndex],
          schedule: this.props.data, allowedFields: this.props.allowedFields,
          recompute: this.recompute
        })}
        overscanColumnCount={2}
        overscanRowCount={1}
      />
    )
  }
}

function cellRenderer(props) {
  const {
    allowedFields,
    columnIndex,
    content,
    key,
    parent,
    rowIndex,
    style,
  } = props

  return (
    <CellMeasurer
      cache={cache}
      columnIndex={columnIndex}
      key={key}
      parent={parent}
      rowIndex={rowIndex}
    >
      {({ measure, registerChild }) => (
        <div style={{ ...style }} ref={registerChild} >
          <Class1 {...props} measure={measure} classI={columnIndex} dayI={rowIndex} allowedFields={allowedFields && allowedFields[rowIndex][columnIndex]} data={content} gridRef={parent} />
        </div>
      )}
    </CellMeasurer>
  );
}

function Class1(props) {
  const { allowedFields, classI, data, students, zoom } = props
  const dayNames = useSelector(state => selectDays(state))

  return (
    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '30pt' }} key={props.dayI}>
      {classI === 0 && <h4 style={{ padding: '34pt 20pt', width: '100pt', color: 'black' }}>{dayNames[props.dayI]}</h4>}
      <div style={{ flex: 1, flexDirection: 'column', padding: '0 30pt 0 5pt' }}>
        <p style={{ paddingRight: '0pt', fontSize: applyZoom(20, zoom) }}>{data.name}</p>
        <div style={{ display: 'flex', flexDirection: 'row' }} key={data.name}>
          {Object.keys(data.students).map((studentId, studentI) => {
            return <Student
              {...props}
              studentId={studentId}
              allowedFields={allowedFields && allowedFields[studentId]}
              studentI={studentI}
              data={data.students[studentId]}
              student={students[studentId]}
            />
          })}
        </div>

      </div>
    </div>
  )
}
function Student(props) {
  const { studentId, dayI, allowedFields, studentI, data, classI, projectId, classNames, student, zoom } = props

  const schedule = data

  const [editFieldCount, editFieldCountResult] = useEditorLessonFieldCountMutation({
    fixedCacheKey: 'editor-edit-field-count',
  })

  useEffect(() => {
    setTimeout(() => {
      props.measure()
    });
  }, [schedule]);

  const addField = () => {
    editFieldCount({ dayI: dayI, studentId: studentId, add: true })
  }
  const removeField = () => {
    editFieldCount({ dayI: dayI, studentId: studentId, add: false })
  }

  return <div
    style={{ marginLeft: applyZoom(6, zoom), marginRight: applyZoom(6, zoom) }}
    key={student.id}>
    <div style={{ paddingLeft: applyZoom(40, zoom) }}>
      <Group>
        <p style={{ fontSize: applyZoom(15, zoom) }}>
          {student.name}
        </p>
        <EditStudentButton student={student} />
      </Group>
    </div>



    {
      data.map((lesson, lessonI) => {
        return <div style={{ margin: `${applyZoom(8, zoom)} 0` }} key={lessonI}>
          {<Field {...props} i={{ dayI: dayI, classI: classI, studentI: studentI, studentId: student.id, lessonI: lessonI }} canPlace={allowedFields && allowedFields[lessonI]} lesson={lesson} />}
        </div>
      })
    }



    {/* <div style={{ padding: '10pt 0 4pt 0', marginTop: '-10pt' }}>
      <Button style={bottomButtonStyle} type="dashed" size='small' shape="round" onClick={() => { addField() }}>+</Button>
      <Button style={bottomButtonStyle} type="dashed" size='small' shape="round" onClick={() => { removeField() }}>-</Button>
    </div> */}


  </div >
}

const fieldStyle = (zoom) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '6pt',
  textAlign: 'center',
  width: applyZoom(180, zoom),
  height: applyZoom(60, zoom),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

export const Field = React.memo(function Field(props) {
  const { i, canPlace, projectId, teachers, lessons, lesson: fieldLesson, zoom } = props
  const lesson = lessons[fieldLesson?.lessonId]
  const teacher = teachers[fieldLesson?.teacherId]

  const lessonId = lesson?.id
  const teacherId = lesson?.id

  const dispatch = useDispatch()

  const [moveLesson, moveLessonResult] = useEditorMoveLessonMutation({
    fixedCacheKey: 'editor-move-lesson',
  })
  const [copyLesson, copyLessonResult] = useEditorCopyLessonMutation({
    fixedCacheKey: 'editor-copy-lesson',
  })

  const [{ isOver, dragged }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return
      }
      const { lessonId, teacherId, i: fromI } = monitor.getItem()

      if (fromI) {
        if (!canPlace) {
          return
        }
        moveLesson({ toI: i, fromI: fromI, projectId: projectId })
      } else {
        copyLesson({ toI: i, lessonId: lessonId, teacherId: teacherId, projectId: projectId })
        // dispatch(lessonSet({ i: i, lesson: { lessonId: lessonId, teacherId: teacherId } }))
      }
      // return ({ item: item, i: i })
    },
    canDrop: () => {
      return true
    },
    collect: (monitor) => {
      return {
        isOver: !!monitor.isOver(),
        dragged: monitor.getItem()
      }
    }
  }), [canPlace, i])

  let divStyle = { border: '1px solid #E8E8E8' }
  if (canPlace !== null && !lessonId) {
    if (!canPlace) {
      divStyle = { border: (isOver ? '1px solid red' : '1px solid #ffccc7'), backgroundColor: '#fff1f0' }
    } else if (isOver) {
      divStyle = { border: isOver ? '1px solid #bae637' : '1px solid #B1B2B6', ...(isOver && { backgroundColor: '#f6ffed' }) }
    }
  }
  console.log(`calc(130pt * ${zoom})`);
  const isDraggingThis = dragged && dragged.i && dragged.i.dayI == i.dayI && dragged.i.studentId == i.studentId && dragged.i.lessonI == i.lessonI

  if (!lesson || lessonId === undefined) {
    return <div style={{ ...fieldStyle(zoom), ...(divStyle) }} ref={drop}></div>
  } else {
    return (
      <div
        style={(isDraggingThis) ? {
          ...(divStyle),
          borderRadius: '6pt'
        } : {}}
        ref={drop}>
        <DraggableLessonBox
          {...props}
          i={i}
          lesson={lesson}
          teacher={teacher}
          roomName={fieldLesson?.room}
        />
      </div>
    )
  }
})