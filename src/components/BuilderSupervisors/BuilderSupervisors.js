import BuilderSupervisors from './BuilderSupervisorsModel'

exports.list = async (req) => {
  return BuilderSupervisors.list()
}

