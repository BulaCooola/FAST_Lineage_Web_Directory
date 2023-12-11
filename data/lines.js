import { lines, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import user from './users.js'
import * as validation from '../validators.js';

const exportedMethods = {
    async createaLine(
        lineName,
        lineDescription,
        lineHead,
        totalMembers,
    ) {
        try {
            lineName = validation.validString(lineName, 'Line Name');
            lineDescription = validation.validString(lineDescription, 'Line Description');
            lineHead = validation.validObject(lineHead, 'Line Object');
            totalMembers = validation.validNumber(totalMembers, 'Total Members');
        } catch (e) {
            throw `${e}`;
        }

        const linesCollection = await lines();
        const checkExistingLine = await linesCollection.findOne({ lineName: lineName });
        if (checkExistingLine) {
            throw `Line Name already exists, pick another`
        }

        let newLine = {
            lineId: new ObjectId(),
            lineName: lineName,
            lineDescription: lineDescription,
            lineHead: lineHead,
            totalMembers: 0,
            members: null,
            images: null
        }
        let insertLine = await linesCollection.insertOne(newLine);
        if (!insertLine.acknowledged || !insertLine.insertedId) {
            throw 'Error: Failed to add line';
        }
        return { insertLine: true };
    },
    async getAllLines() {
        const linesCollection = await lines();
        return await linesCollection.find({}).toArray();
    },
    async getLineById(id) {
        id = validation.validId(id);            //subject to change
        const linesCollection = await lines();
        const line = await linesCollection.findOne({ _id: new ObjectId(id) });
        if (!line) throw 'Error: Line not found';
        return line;
    },
    async getLineByName(name) {
        name = validation.validString(name);        //subject to change
        const linesCollection = await lines();
        const line = await linesCollection.findOne({ lineName: name });
        if (!line) throw 'Error: Line not found';
        return line;
    },
    async createLine(name) {
        const linesCollection = await lines();

        try {
            name = validation.validString(name, 'Line Name');
        } catch (e) {
            throw `${e}`;
        }

        let newLine = {
            lineName: name,
            lineDescription: null,
            lineHead: null,
            members: []
        }
        let insertLine = await linesCollection.insertOne(newLine);
        if (!insertLine.acknowledged || !insertLine.insertedId) {
            throw 'Error: Failed to add line';
        }
        return { insertLine: true };
    },
    async addLineHead(head, lineName) {
        const usersCollection = await users();
        const validateUser = await usersCollection.findOne({ userName: head.userName });
        if (!validateUser) {
            throw `Error: User inputted as line head does not exist. Please input an existing`
        }
        const lineHeadInfo = {
            _id: validateUser._id,
            userName: validateUser.userName,
            firstName: validateUser.firstName,
            lastName: validateUser.lastName,
            email: validateUser.email,
            line: validateUser.line,
            big: validateUser.big,
            littles: validateUser.littles,
            links: validateUser.links
        }

        const linesCollection = await lines();
        const findLine = await linesCollection.findOne({ lineName: lineName })
        if (!findLine) {
            throw `Error: lineName provided does not exist in database`;
        }
        if (findLine.lineHead !== null) {
            throw `Error: lineHead already exists, cannot add anymore`;
        }

        const updateLineHead = await linesCollection.updateOne(
            { _id: findLine._id },
            {
                $set: { lineHead: lineHeadInfo },
                $push: { members: lineHeadInfo }
            },
        )

        if (updateLineHead.modifiedCount === 0) { throw `Error: Could not add line Head` }

        return { status: "success", message: "Line head added successfully." };
    },
    async updateLine(name, littles) {
        let updatedLine = {
            littles: littles
        }
        const linesCollection = await lines();
        const newLine = await linesCollection.findOneAndReplace(
            name,
            updatedLine,
            { returnDocument: 'after' }
        );
        if (!newLine) {
            throw 'could not update line successfully';
        }
        return newLine;
    },
    async deleteLine(name) {
        const linesCollection = await lines();
        const deletionInfo = await linesCollection.findOneAndDelete({
            name: name
        });

        if (!deletionInfo) {
            throw 'Could not delete line ${name}';
        }
        return `${deletionInfo.name} has been deleted.`;
    },
    async getChildren(userName) {
        const person = await user.getUserByUserName(userName);
        if (person) {
            console.log(person.children.map(childUserName => getUserByUserName(childUserName)))
            return person.children.map(childUserName => getUserByUserName(childUserName))
        } else {
            return []
        }
    },
    async addMember(lineName, member) {
        // lineName refers to the name of line
        // member refers to the object of the user
        const linesCollection = await lines();
        const usersCollection = await users();
        const line = await linesCollection.findOne({ lineName: lineName });
        const user = await usersCollection.findOne({ userName: member.userName });
        if (!line) {
            throw `Error: Line does not exist.`
        }
        if (!user) {
            throw `Error: User does not exist.`
        }

        const memberInfo = {
            _id: user._id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            line: user.line,
            big: user.big,
            littles: user.littles,
            links: user.links
        }

        function findPerson(arr, id, email, userName) {
            const find_id = arr.find(person => person._id === id)
            const find_email = arr.find(person => person.email === email)
            const find_userName = arr.find(person => person.userName === userName)
            if (find_id || find_email || find_userName) { return true; }
            else { return false; }
        }
        const memberFind = findPerson(line.members, memberInfo._id, memberInfo.email, memberInfo.userName)

        if (memberFind) {
            return { status: "failed", message: "Member not added." };
        } else {
            const updateMembers = await linesCollection.updateOne(
                { _id: line._id },
                {
                    $push: { "members": memberInfo }
                },
            )

            if (updateMembers.modifiedCount === 0) { throw `Error: Could not add line Head` }

            return { status: "success", message: "Member added successfully." };
        }
    },
    async membersTree(user) {
        return null;
    }
};

// // TODO getLine
// // TODO getAllLines
// TODO updateLine
// TODO deleteLine

export default exportedMethods;

