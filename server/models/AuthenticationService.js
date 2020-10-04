// @flow
import { DataTypes, sequelize, encryptedFields } from "../sequelize";
import { User,Team } from ".";

const AuthenticationService = sequelize.define("authentication_services", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  data: DataTypes.JSONB,
  serviceId: DataTypes.STRING,
  authenticatableId: DataTypes.UUID,
  authenticatableType: DataTypes.STRING
},{
  timestamps: true
});

AuthenticationService.associate = models => {
  AuthenticationService.belongsTo(models.User, {
    as: "user",
    foreignKey: "authenticatableId",
    constraints: false
  });
  AuthenticationService.belongsTo(models.Team, {
    as: "team",
    foreignKey: "authenticatableId",
    constraints: false
  });
};

AuthenticationService.fetchUser = async (options,userOpts) => {
  //Find authentication
  return await AuthenticationService.findOne({
    where: { 
      ...options,
      authenticatableType:"user" 
    },
    include:{
      model:User,
      as: "user",
      where:{
        ...userOpts
      },
      required:true,
      include: [{
        model: AuthenticationService,
        as: "authentications",
        required: true
      }]
    }
  }).then((obj)=>{
    if(obj)
      return obj.user;
    return null;
  });
};

AuthenticationService.fetchTeam = async (options,teamOpts) => {
  //Find authentication
  return await AuthenticationService.findOne({
    where: { 
      ...options,
      authenticatableType:"team" 
    },
    include:{
      model:Team,
      as: "team",
      where:{
        ...teamOpts
      },
      include:[{
        model: AuthenticationService,
        as: "authentication",
        required: true
      }]
    }
  }).then((obj)=>{
    if(obj)
      return obj.team
    return null;
  });
};

AuthenticationService.addScope("byService",
    (serviceName,serviceId) => {
      return { 
        where:{
            name: serviceName,
            serviceId:serviceId
        }
      }
    });

export default AuthenticationService;
