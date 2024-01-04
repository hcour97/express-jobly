"use strict";

const { restart } = require("nodemon");
const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
const Job = require("./job.js");
const { findAll } = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create", function () {
    let newJob = {
        companyHandle: "c1",
        title: "New",
        salary: 500, 
        equity: "0.5",
    };

    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual({
            ...newJob,
            id: expect.any(Number),
        });
    });
});

/************************************** findAll */
describe("findAll", function () {
    test("works: no filter", async function () {
      let jobs = await Job.findAll();
      expect(jobs).toEqual([
        {
          id: testJobIds[0],
          title: "Job1",
          salary: 100,
          equity: "0.1",
          companyHandle: "c1",
          companyName: "C1",
        },
        {
          id: testJobIds[1],
          title: "Job2",
          salary: 200,
          equity: "0.2",
          companyHandle: "c1",
          companyName: "C1",
        },
        {
          id: testJobIds[2],
          title: "Job3",
          salary: 300,
          equity: "0",
          companyHandle: "c1",
          companyName: "C1",
        },
        {
          id: testJobIds[3],
          title: "Job4",
          salary: null,
          equity: null,
          companyHandle: "c1",
          companyName: "C1",
        },
      ]);
    });

    test("works: with title filter", async function() {
        let jobs = await Job.findAll({title: "job1"});
        expect(jobs).toEqual([
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: "0.1",
                companyHandle: "c1",
                companyName: "C1",
              },
        ]);
    })

    test("works: with minSalary filter", async function() {
        let jobs = await Job.findAll({minSalary: 215});
        expect(jobs).toEqual([
            {
                id: testJobIds[2],
                title: "Job3",
                salary: 300,
                equity: "0",
                companyHandle: "c1",
                companyName: "C1",
            }
        ])
    })

    test("works: with equity filter", async function() {
        let jobs = await Job.findAll({ hasEquity : true });
        expect(jobs).toEqual([
            {
                id: testJobIds[0],
                title: "Job1",
                salary: 100,
                equity: "0.1",
                companyHandle: "c1",
                companyName: "C1",
              },
              {
                id: testJobIds[1],
                title: "Job2",
                salary: 200,
                equity: "0.2",
                companyHandle: "c1",
                companyName: "C1",
              },
        ])
    })

    test("works: with equity and minSalary filter", async function() {
        let jobs = await Job.findAll({ hasEquity : true, minSalary: 125 });
        expect(jobs).toEqual([
              {
                id: testJobIds[1],
                title: "Job2",
                salary: 200,
                equity: "0.2",
                companyHandle: "c1",
                companyName: "C1",
              },
        ])
    });
})

/************************************** get */

describe("get", function () {
    test("works", async function () {
        let job = await Job.get(testJobIds[0]);
        expect(job).toEqual({
          id: testJobIds[0],
          title: "Job1",
          salary: 100,
          equity: "0.1",
          company: {
            handle: "c1",
            name: "C1",
            description: "Desc1",
            numEmployees: 1,
            logoUrl: "http://c1.img",
          },
        });
    })

    test("If no job, throw error", async function () {
        try {
            await Job.get(0);
            findAll();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    })
})

/************************************** update */
describe("update", function () {
    const updateData = {
        title: "New",
        salary: 800,
        equity: "0.8",
      };

    test("works", async function () {
        let job = await Job.update(testJobIds[1], updateData);
        expect(job).toEqual({
        id: testJobIds[1],
        companyHandle: "c1",
        ...updateData,
        });
    })

    test("If no job, throw error", async function () {
        try {
            await Job.update(0, {title: "test"});
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    })

    test("bad request: no data", async function () {
        try {
            await Job.update(testJobIds[1], {});
            fail();
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    });
})

/************************************** remove */

describe("remove", function() {
    test("works", async function () {
        try {
            await Job.remove(0);
            fail();
        } catch (e) {
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });
})
