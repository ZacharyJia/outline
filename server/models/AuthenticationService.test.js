import TestServer from "fetch-test-server";
import app from "../app";
import { AuthenticationService,User} from ".";
import { flushdb, seed } from "../test/support";
import { buildDocument } from "../test/factories";
import * as Slack from "../slack";
import { includes } from "lodash";
import { Op } from "sequelize";
 
beforeEach(flushdb);


jest.mock("../slack", () => ({
  post: jest.fn(),
}));

describe("#auths", async () => {
    it("should find user by auth",async () =>{
        const {user,team} = await seed();
        const userTest = await AuthenticationService.fetchUser({
            name: "slack",
            serviceId: user.getAuth("slack").serviceId
        })
        
        expect(user.id).toEqual(userTest.id)
    })
    it("should fetch existing user",async () =>{
        const {user,team} = await seed();
        
        let [userTest,isFirstLogin] = await User.findOrCreateWithAuth({
        where:{
            teamId: team.id
        },
        auth:{
            name: "slack",
            serviceId: user.getAuth("slack").serviceId
        },defaults:{
            name: user.name,
            email: user.email
        }});

        expect(user.id).toEqual(userTest.id)
        expect(isFirstLogin).toEqual(false)
    })
    it("should create authentication", async () => {
        const { user, team } = await seed();
        
        let [userTest,,newAuthCreated] = await User.findOrCreateWithAuth({
        where:{
            teamId: team.id
        },
        auth:{
            name: "google",
            serviceId: "UG2399UF1P"
        },defaults:{
            name: user.name,
            email: user.email
        }});

        expect(userTest.getAuth("google")).toBeDefined()
        expect(newAuthCreated).toEqual(true);
    })
    it("should create new user and authentication", async () => {
        const { user, team } = await seed();
        
        let [userTest,isFirstLogin,newAuthCreated] = await User.findOrCreateWithAuth({
        where:{
            teamId: team.id,
            name: "User 2",
            email: "user2@test.com"
        },
        auth:{
            name: "google",
            serviceId: "UG2399UF1P"
        },
        defaults:{
            
        }
        });

        expect(userTest.getAuth("google")).toBeDefined()
        expect(isFirstLogin).toEqual(true);
    })
   
});