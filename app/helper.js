const path = require('path')
const iconLogo = path.join(__dirname, 'images', 'avatarLexLuthor.jpeg');


const getProjectInfo = (project) => {
  switch (project) {
    case 'template':
      return {
        name: 'template name',
        link: iconLogo,
      }

    default:
      return null
  }
}

module.exports = { getProjectInfo }
