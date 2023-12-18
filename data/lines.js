import { lines, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as validation from '../validators.js';

const exportedMethods = {
    async getAllLines() {
        const linesCollection = await lines();
        return await linesCollection.find({}).toArray();
    },
    async getLineById(id) {
        id = validation.validId(id);
        const linesCollection = await lines();
        const line = await linesCollection.findOne({ _id: new ObjectId(id) });
        if (!line) throw 'Error: Line not found';
        return line;
    },
    async getLineByName(name) {
        name = validation.validString(name);
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
            members: [],
            pictures: [],
            messages: [],
            hangouts: []
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
    async addMember(lineName, member) {
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
    async createMessage(userName, msg, line) {
        const linesCollection = await lines();

        try {
            userName = validation.validString(userName, 'UserName');
            msg = validation.validString(msg, 'Message');
            if (msg.length > 1000) {
                throw `Error: Message limit passed (1000 characters).`;
            }
            line = validation.validString(line, 'Line');
        } catch (e) {
            throw `${e}`
        }

        try {
            // get the line4
            const getLine = await linesCollection.findOne({ lineName: line })
            if (!getLine) {
                // 404
                throw `Error: Line not found`;
            }

            const newMessage = {
                _id: getLine.messages.length,
                timestamp: new Date().toUTCString(),
                userName: userName,
                text: msg
            }

            const result = await linesCollection.updateOne(
                { lineName: line },
                { $push: { messages: newMessage } }
            );

            if (result.matchedCount !== 1) {
                throw `Error: Unable to add message to database.`;
            }

        } catch (e) {
            throw `${e}`;
        }
    },
    async updateAncestorsLittles(userCollection, userName, little) {
        let currentUserName = userName;

        while (currentUserName) {
            const user = await userCollection.findOne({ userName: currentUserName });

            if (!user || !user.big) {
                break;
            }

            const big = await userCollection.findOne({ userName: user.big });

            if (!big) {
                break;
            }

            if (big.littles.some(l => l.userName === user.userName)) {
                console.log("we found someone equal: " + user.userName);
                await userCollection.updateOne(
                    { _id: big._id, 'littles.userName': user.userName },
                    { $push: { 'littles.$.littles': little } }
                );
            }

            little = user;
            currentUserName = big.userName;
        }
    },
    // referenced lab 6
    async getAllHangouts(line) {
        // returns a list of hangouts from line
        const linesCollection = await lines();
        const lineEvent = await linesCollection.findOne({ lineName: line });
        const hangouts = lineEvent.hangouts;
        return hangouts
    },
    async getHangoutById(id, line) {
        id = validation.validId(id);
        const linesCollection = await lines()
        const lineEvent = await linesCollection.findOne({ lineName: line });
        const hangout = lineEvent.hangout.filter(id => hangout._id === id)
        if (!hangout) throw 'Error: Event not found';
        return hangout;
    },
    async removeHangout(eventName, line) {
        try {
            eventName = validation.validString(eventName, 'eventName');
            line = validation.validString(line, 'line');
        } catch (e) {
            throw `${e}`;
        }
        const linesCollection = await lines()
        const the_line = await linesCollection.findOne({ lineName: line });
        const lineHangouts = the_line.hangouts;

        const filterHangouts = lineHangouts.filter(obj => obj.eventName !== eventName);
        const deleted = lineHangouts.filter(obj => obj.eventName == eventName);

        const deletedObject = {
            eventName: deleted.eventName,
            deleted: null
        };

        const deletedHangout = await linesCollection.findOneAndUpdate(
            { lineName: line },
            { $set: { hangouts: filterHangouts } },
            { returnDocument: 'after' }
        )
        if (!deletedHangout) { throw `Error could not find event ${eventName}`; }
        deletedObject.deleted = true;
        return deletedObject;
    },
    async createHangout(
        line,
        eventName,
        description,
        eventLocation,
        eventDate,
        startTime,
        endTime
    ) {
        // validate parameters
        // console.log(eventLocation);
        try {
            eventName = validation.validTitle(eventName, "Event Name")
            description = validation.validBio(description, "Event Description")
            eventLocation.streetAddress = validation.validAddress( eventLocation.streetAddress, "Event Address")
            eventLocation.city = validation.validCity(eventLocation.city, "Event City")
            eventLocation.state = validation.validState(eventLocation.state, "Event State")
            eventLocation.zip = validation.validZipcode(eventLocation.zip, "Event Zipcode")
            let time = validation.validTime(startTime, endTime)
            eventDate = validation.validDate(eventDate, "Event Date")
        }
        catch (e) {
            throw `${e}`
        }

        const newEvent = {
            _id: new ObjectId(),
            timestamp: new Date().toUTCString(),
            eventName: eventName,
            description: description,
            eventLocation: eventLocation,
            eventDate: eventDate,
            startTime: startTime,
            endTime: endTime,
            attendees: [],
            totalAttendees: 0
        }

        const lineCollection = await lines();
        const insertHangout = await lineCollection.findOneAndUpdate(
            { lineName: line },
            {
                $push: {
                    hangouts: newEvent
                }
            }
        )
        if (!insertHangout) {
            throw `Error: Could not add event`;
        }
        return insertHangout.hangouts;
    },
    async addAttendee(
        eventName,
        line,
        firstName,
        lastName,
        email
    ) {
        // validate attendees
        try {
            eventName = validation.validString(eventName, 'event name');
            line = validation.validString(line, 'line');
            firstName = validation.validName(firstName, 'first name');
            lastName = validation.validName(lastName, 'last name');
            email = validation.validEmail(email, 'email');
        } catch(e) {
            throw `${e}`;
        }

        const newAttendeeId = new ObjectId();
        const newAttendee = {
            _id: newAttendeeId,
            firstName: firstName,
            lastName: lastName,
            email: email
        }

        const lineCollection = await lines()
        const eventNew = await lineCollection.findOne({ lineName: line })
        if (eventNew) {
            // find the hangout with the id
            const getHangouts = eventNew.hangouts
            const filterHangouts = getHangouts.filter(obj => obj.eventName === eventName);

            // check if user is already there
            const attendeesList = filterHangouts[0].attendees;
            const findDuplicate = attendeesList.filter(obj => obj.email === email);
            if (findDuplicate.length > 0) {
                throw `Error: User already added to hangout`
            }

            let add = filterHangouts[0].attendees.push(newAttendee)
            add = filterHangouts[0].totalAttendees += 1;

            const updatedInfo = await lineCollection.findOneAndUpdate(
                { lineName: line },
                { $set: { hangouts: filterHangouts } },
                { returnDocument: 'after' }
            )
            return updatedInfo
        } else {
            throw `Error: Could not update attendee successfully`
        }
    }

};

export default exportedMethods;

