const modules = require('./modules')
const chapters = require('./chapters')

const chapterTotalDuration = {}

modules.forEach((module) => {
  const { chapterId, duration } = module
  if (!chapterTotalDuration[chapterId]) {
    chapterTotalDuration[chapterId] = 0
  }
  chapterTotalDuration[chapterId] += duration
})

chapters.forEach((chapter, index) => {
  const chapterId = index + 1
  const totalDuration = chapterTotalDuration[chapterId] || 0

  // eslint-disable-next-line no-param-reassign
  chapter.totalDuration = totalDuration
})

module.exports = {
  chapters,
  modules,
}
