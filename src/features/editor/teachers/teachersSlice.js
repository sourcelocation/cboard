import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { selectAllLessons } from '../lessons/lessonsSlice';
import { lessonDeleted } from '../students/studentSlice';

export const teachersAdapter = createEntityAdapter()
const initialState = teachersAdapter.getInitialState()


export const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    taughtLessonAddedForIds: (state, action) => {
      const { lessonId, teacherIds, set } = action.payload
      if (set) {
        for (const tkey in state.entities) {
          state.entities[tkey].taughtLessons = state.entities[tkey].taughtLessons.filter(l => l.id !== lessonId)
        }
      }
      teacherIds.forEach(teacherId => {
        const existingTeacher = state.entities[teacherId]
        if (existingTeacher) {
          existingTeacher.taughtLessons.push({ id: lessonId })
        }
      });
    },
    teacherAdded: teachersAdapter.addOne,
    teacherUpdated: teachersAdapter.updateOne,
    teacherDeleted: teachersAdapter.removeOne,
  },
});

export function deleteTeacher(id) {
  return (dispatch, getState) => {
    dispatch(teachersSlice.actions.teacherDeleted(id))
    const state = getState()

    for (const studentId in state.students.entities) {
      for (const [dayI, day] of state.students.entities[studentId].schedule.entries()) {
        for (const [lessonI, lesson] of state.students.entities[studentId].schedule[dayI].entries()) {
          if (lesson.teacherId == id) {
            dispatch(lessonDeleted({ studentId: studentId, dayI: dayI, lessonI: lessonI }))
          }
        }
      }
    }
  }
}

export const { taughtLessonAddedForIds, teacherAdded, teacherUpdated } = teachersSlice.actions;

export const { selectAll: selectAllTeachers, selectById: selectTeacherById } =
  teachersAdapter.getSelectors(state => state.teachers)

export const selectTeachersByLesson = createSelector(
  [selectAllLessons, selectAllTeachers, (state, lessonId) => lessonId],
  (lessons, teachers, lessonId) => {
    const res = Object.values(teachers).filter(teacher => {
      return teacher.taughtLessons
        .map(lesson => lesson.id)
        .includes(lessonId)
    })
    return res
  }
)

export default teachersSlice.reducer;
