import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { lessonDeleted } from '../students/studentSlice';

export const lessonsAdapter = createEntityAdapter()

const emptyInitialState = lessonsAdapter.getInitialState()
const initialState = lessonsAdapter.upsertMany(emptyInitialState, [
  // { id: 1, name: "Математика", color: "green" },
  // { id: 2, name: "Русский язык", color: "blue" },
  // { id: 3, name: "Обществознание", color: "lightblue" },
  // { id: 4, name: "Физика", color: "pink" },
  // { id: 5, name: "Литература", color: "lime" },
  // { id: 6, name: "Информатика", color: "gray" }
])

export const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    lessonAdded: lessonsAdapter.addOne,
    lessonUpdated: lessonsAdapter.updateOne,
    copyableLessonDeleted: lessonsAdapter.removeOne,
  },
});

export function deleteCopyableLesson(id) {
  return (dispatch, getState) => {
    dispatch(lessonsSlice.actions.copyableLessonDeleted(id))

    const state = getState()

    for (const studentId in state.students.entities) {
      for (const [dayI, day] of state.students.entities[studentId].schedule.entries()) {
        for (const [lessonI, lesson] of state.students.entities[studentId].schedule[dayI].entries()) {
          if (lesson.lessonId == id) {
            dispatch(lessonDeleted({ studentId: studentId, dayI: dayI, lessonI: lessonI }))
          }
        }
      }
    }
  }
}

export default lessonsSlice.reducer;
export const { lessonAdded, lessonUpdated } = lessonsSlice.actions

export const {
  selectAll: selectAllLessons,
  selectById: selectLessonById,
  selectIds: selectLessonIds
} = lessonsAdapter.getSelectors(state => state.lessons)