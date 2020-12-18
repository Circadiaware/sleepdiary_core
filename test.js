const new_sleep_diary = (
    ( typeof module !== "undefined" && module.exports )
        ? require("./sleep-diary-formats.js")
        : window
).new_sleep_diary;

function test_constructor(test) {
    var diary = null, error = false;
    try {
        if ( typeof(test.input) == "string" || test.input.file_format ) {
            diary = new_sleep_diary(test.input);
        } else {
            diary = new_sleep_diary({ "file_format": () => "archive", "contents": test.input });
        }
    } catch (e) {
        if ( !test.error ) console.warn(e);
        error = true;
    }

    it(`produces the correct error for "${test.name}"`, function() {
        expect(error).toEqual(!!test.error);
    });

    return error == !!test.error ? diary : null;
}


function test_parse(test) {

    if ( !test.name ) test.name = "format's 'parse' test";

    var diary = test_constructor(test);

    if ( diary ) {

        it(`reads test "${test.name}" correctly`, function() {
            expect(Object.assign({},diary)).toEqual(test.expected);
        });

        it(`produces a file of the correct format for "${test.name||"format's 'parse' test"}"`, function() {
            expect(diary.file_format()).toEqual(test.file_format);
        });

        it(`URL-ifies "${test.name||"format's 'parse' test"}" correctly`, function() {
            expect(diary).toEqual(new_sleep_diary({
                "file_format": "url",
                "contents": diary.to("url"),
            }));
        });

    }

}

function test_from_standard(test) {

    if ( !test.name ) test.name = "format's 'from standard' test";

    var diary = test_constructor({
        name: test.name,
        input: {
            "file_format": () => "Standard",
            contents: {
                file_format: "Standard",
                records: test.input
            }
        }});
    var expected_diary = test_constructor({ name: test.name, input: test.expected });

    if ( diary && expected_diary ) {

        it(`initialises "${test.name}" from Standard format correctly"`, function() {
            expect( diary.to(test.format) ).toEqual( expected_diary );
        });

    }

}

function test_to(test) {

    if ( !test.name ) test.name = "format's 'to' test";

    var diary = test_constructor(test);

    if ( diary ) {

        if ( test.format == "Standard" ) {
            it(`converts "${test.name}" to "${test.format}" correctly"`, function() {
                expect( diary.to(test.format).records ).toEqual( test.expected );
            });
        } else {
            it(`converts "${test.name}" to "${test.format}" correctly"`, function() {
                expect( diary.to(test.format).contents ).toEqual( test.expected );
            });
        }

    }

}

function test_merge(test) {

    if ( !test.name ) test.name = "format's 'merge' test";

    it(`merges "${test.name}" correctly"`, function() {
        expect(
            Object.assign(
                {},
                new_sleep_diary(test.left)
                    .merge(new_sleep_diary(test.right))
            )
        ).toEqual(test.expected);
    });

}
describe("Standard format", () => {

    function wrap_expected(expected) { return expected; }

    function wrap_input(contents) {
        contents.file_format = "Standard";
        return {
            "file_format": () => "Standard",
            "contents": contents,
        }
    }

    test_parse({
        name: "simple example",
        file_format:"Standard",
        input: "{\"file_format\":\"Standard\",\"records\":[]}",
        expected: {
            minimum_day_duration: 72000000,
            maximum_day_duration: 144000000,
            records: [],
        }
    });

    test_parse({
        name: "invaid JSON",
        parseable: true,
        file_format:"Standard",
        input: '{',
        error: true,
    });

    test_parse({
        name: "missing records",
        file_format:"Standard",
        input:  { "file_format": "Standard" },
        error: true,
    });

    test_parse({
        name: "input object",
        file_format:"Standard",
        input:  wrap_input({
            "records": [],
        }),
        expected: {
            minimum_day_duration: 72000000,
            maximum_day_duration: 144000000,
            records: [],
        }
    });

    test_parse({
        name: "min/max durations",
        file_format:"Standard",
        input: wrap_input({
            "records": [],
            "minimum_day_duration": 1,
            "maximum_day_duration": 2,
        }),
        expected: wrap_expected({
            minimum_day_duration: 1,
            maximum_day_duration: 2,
            records: [],
        }),
    });

    test_parse({
        name: "records with various members defined",
        file_format:"Standard",
        input: wrap_input({ "file_format": "Standard", "records": [
            {
                start               : 1,
                end                 : 2,
                duration            : 3,
                status              : "awake",
                comments            : [
                    "comment 1",
                    { time: 4, text:"comment 2" },
                ],
                day_number          : 1,
                start_of_new_day    : true,
                is_primary_sleep    : true,
                missing_record_after: true,
            },
            {
                start               : 1,
                end                 : 2,
                //duration            : 3,
                status              : "awake",
                comments            : [
                    "comment 1",
                    { time: 4, text:"comment 2" },
                ],
                day_number          : 1,
                start_of_new_day    : true,
                is_primary_sleep    : true,
                missing_record_after: true,
            },
            {
                start               : 1,
                //end                 : 2,
                //duration            : 3,
                status              : "awake",
                comments            : [
                    "comment 1",
                    { time: 4, text:"comment 2" },
                ],
                day_number          : 1,
                start_of_new_day    : true,
                is_primary_sleep    : true,
                missing_record_after: true,
            },
            {
                start               : 1,
                //end                 : 2,
                //duration            : 3,
                status              : "awake",
                comments            : [
                    "comment 1",
                    { time: 4, text:"comment 2" },
                ],
                //day_number          : 1,
                start_of_new_day    : true,
                is_primary_sleep    : true,
                missing_record_after: true,
            },
            {
                start               : 1,
                //end                 : 2,
                //duration            : 3,
                status              : "awake",
                comments            : [
                    "comment 1",
                    { time: 4, text:"comment 2" },
                ],
                //day_number          : 1,
                //start_of_new_day    : true,
                is_primary_sleep    : true,
                missing_record_after: true,
            },
            {
                start               : 1,
                //end                 : 2,
                //duration            : 3,
                status              : "awake",
                comments            : [
                    "comment 1",
                    { time: 4, text:"comment 2" },
                ],
                //day_number          : 1,
                //start_of_new_day    : true,
                //is_primary_sleep    : true,
                missing_record_after: true,
            },
            {
                start               : 1,
                //end                 : 2,
                //duration            : 3,
                status              : "awake",
                comments            : [
                    "comment 1",
                    { time: 4, text:"comment 2" },
                ],
                //day_number          : 1,
                //start_of_new_day    : true,
                //is_primary_sleep    : true,
                //missing_record_after: true,
            },
        ] }),
        expected: wrap_expected({
            minimum_day_duration: 72000000,
            maximum_day_duration: 144000000,
            records: [
                {
                    start               : 1,
                    end                 : 2,
                    duration            : 3,
                    status              : "awake",
                    comments            : [
                        "comment 1",
                        { time: 4, text:"comment 2" },
                    ],
                    day_number          : 1,
                    start_of_new_day    : true,
                    is_primary_sleep    : true,
                    missing_record_after: true,
                },
                {
                    start               : 1,
                    end                 : 2,
                    duration            : 1,
                    status              : "awake",
                    comments            : [
                        "comment 1",
                        { time: 4, text:"comment 2" },
                    ],
                    day_number          : 1,
                    start_of_new_day    : true,
                    is_primary_sleep    : true,
                    missing_record_after: true,
                },
                {
                    start               : 1,
                    duration            : null,
                    status              : "awake",
                    comments            : [
                        "comment 1",
                        { time: 4, text:"comment 2" },
                    ],
                    day_number          : 1,
                    start_of_new_day    : true,
                    is_primary_sleep    : true,
                    missing_record_after: true,
                },
                {
                    start               : 1,
                    duration            : null,
                    status              : "awake",
                    comments            : [
                        "comment 1",
                        { time: 4, text:"comment 2" },
                    ],
                    day_number          : 2,
                    start_of_new_day    : true,
                    is_primary_sleep    : true,
                    missing_record_after: true,
                },
                {
                    start               : 1,
                    duration            : null,
                    status              : "awake",
                    comments            : [
                        "comment 1",
                        { time: 4, text:"comment 2" },
                    ],
                    day_number          : 2,
                    start_of_new_day    : false,
                    is_primary_sleep    : true,
                    missing_record_after: true,
                },
                {
                    start               : 1,
                    duration            : null,
                    status              : "awake",
                    comments            : [
                        "comment 1",
                        { time: 4, text:"comment 2" },
                    ],
                    day_number          : 2,
                    start_of_new_day    : false,
                    missing_record_after: true,
                },
                {
                    start               : 1,
                    duration            : null,
                    status              : "awake",
                    comments            : [
                        "comment 1",
                        { time: 4, text:"comment 2" },
                    ],
                    day_number          : 2,
                    start_of_new_day    : false,
                },
            ],
        }),
    });

    test_parse({
        name: "Day-length calculations",
        file_format:"Standard",
        input: wrap_input({ "file_format": "Standard", "records": [
            {
                start               : 72000000*0,
                status              : "asleep",
            },
            {
                start               : 72000000*1,
                status              : "asleep",
            },
            {
                start               : 72000000*1 + 1,
                status              : "asleep",
            },
            {
                start               : 72000000*3 + 1,
                status              : "asleep",
            },
            {
                start               : 72000000*5 + 2,
                status              : "asleep",
            },
        ] }),
        expected: wrap_expected({
            minimum_day_duration: 72000000,
            maximum_day_duration: 144000000,
            records: [
                {
                    start               : 72000000*0,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 0,
                    start_of_new_day    : false,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*1,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 0,
                    start_of_new_day    : false,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*1 + 1,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 1,
                    start_of_new_day    : true,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*3 + 1,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 2,
                    start_of_new_day    : true,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*5 + 2,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 4,
                    start_of_new_day    : true,
                },
            ],
        }),
    });

    test_parse({
        name: "Day-length calculations with specified min/max duration",
        file_format:"Standard",
        input: wrap_input({
            "file_format": "Standard",
            "records": [
                {
                    start               : 72000000*0,
                    status              : "asleep",
                },
                {
                    start               : 72000000*1,
                    status              : "asleep",
                },
                {
                    start               : 72000000*1 + 1,
                    status              : "asleep",
                },
                {
                    start               : 72000000*3 + 1,
                    status              : "asleep",
                },
                {
                    start               : 72000000*5 + 2,
                    status              : "asleep",
                },
            ],
            "minimum_day_duration": 1,
            "maximum_day_duration": Math.pow(2,63),
        }),
        expected: wrap_expected({
            minimum_day_duration: 1,
            maximum_day_duration: Math.pow(2,63),
            records: [
                {
                    start               : 72000000*0,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 0,
                    start_of_new_day    : false,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*1,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 1,
                    start_of_new_day    : true,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*1 + 1,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 1,
                    start_of_new_day    : false,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*3 + 1,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 2,
                    start_of_new_day    : true,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*5 + 2,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 3,
                    start_of_new_day    : true,
                },
            ],
        }),
    });

    test_parse({
        name: "Out-of-order records",
        file_format:"Standard",
        input: wrap_input({
            "file_format": "Standard",
            "records": [
                {
                    start               : 72000000*1,
                    status              : "asleep",
                },
                {
                    start               : 72000000*0,
                    status              : "asleep",
                },
            ],
        }),
        expected: wrap_expected({
            minimum_day_duration: 72000000,
            maximum_day_duration: 144000000,
            records: [
                {
                    start               : 72000000*0,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 0,
                    start_of_new_day    : false,
                    missing_record_after: true,
                },
                {
                    start               : 72000000*1,
                    duration            : null,
                    status              : "asleep",
                    day_number          : 0,
                    start_of_new_day    : false,
                },
            ],
        }),
    });

    test_parse({
        name: "Multiple sleeps",
        file_format:"Standard",
        input: wrap_input({
            "file_format": "Standard",
            "records": [
                {
                    duration: 1,
                    status  : "asleep",
                },
                {
                    duration: 2,
                    status  : "asleep",
                },
            ],
        }),
        expected: wrap_expected({
            minimum_day_duration: 72000000,
            maximum_day_duration: 144000000,
            records: [
                {
                    duration            : 1,
                    status              : "asleep",
                    day_number          : 0,
                    start_of_new_day    : false,
                    missing_record_after: true,
                },
                {
                    duration            : 2,
                    status              : "asleep",
                    day_number          : 0,
                    start_of_new_day    : false,
                    is_primary_sleep    : true,
                },
            ],
        }),
    });

    it(`serialises data correctly`, function() {
        expect(
            new_sleep_diary(wrap_input({
                "records": [
                    {
                        duration: 1,
                        status  : "asleep",
                    },
                    {
                        duration: 2,
                        status  : "asleep",
                    },
                ],
            })).to("output").contents
        ).toEqual('{"file_format":"Standard","records":[{"duration":1,"status":"asleep","start_of_new_day":false,"day_number":0,"missing_record_after":true},{"duration":2,"status":"asleep","start_of_new_day":false,"day_number":0,"is_primary_sleep":true}],"minimum_day_duration":72000000,"maximum_day_duration":144000000}');
    });

    it(`merges data correctly`, function() {

        var tests = [
            {
                left: [],
                right: [],
                expected: [],
            },
            {
                left: [ { start: 1, end: 2 } ],
                right: [],
                expected: [ { start: 1, end: 2, duration: 1, start_of_new_day: false, day_number: 0 } ],
            },
            {
                left: [],
                right: [ { start: 1, end: 2 } ],
                expected: [ { start: 1, end: 2, duration: 1, start_of_new_day: false, day_number: 0 } ],
            },
            {
                left: [ { start: 1, end: 2 } ],
                right: [ { start: 1, end: 2 } ],
                expected: [ { start: 1, end: 2, duration: 1, start_of_new_day: false, day_number: 0 } ],
            },
            {
                left: [ { start: 2, end: 3 } ],
                right: [ { start: 1, end: 2 } ],
                expected: [
                    { start: 1, end: 2, duration: 1, start_of_new_day: false, day_number: 0 },
                    { start: 2, end: 3, duration: 1, start_of_new_day: false, day_number: 0 },
                ],
            },
            {
                left: [ { start: 1, end: 2 } ],
                right: [ { start: 2, end: 3 } ],
                expected: [
                    { start: 1, end: 2, duration: 1, start_of_new_day: false, day_number: 0 },
                    { start: 2, end: 3, duration: 1, start_of_new_day: false, day_number: 0 },
                ],
            },
        ];

        tests.forEach(function(test) {
            expect(Object.assign(
                {},
                new_sleep_diary(wrap_input({
                    "file_format": "Standard",
                    "records": test.left,
                })).merge(new_sleep_diary(wrap_input({
                    "file_format": "Standard",
                    "records": test.right,
                })))
            )).toEqual({
                    "minimum_day_duration":  72000000,
                    "maximum_day_duration": 144000000,
                    "records": test.expected,
                });
        });

    });

    it(`summarises records correctly`, function() {

        var tests = [
            {
                records: [],
                expected: null,
            },
            {
                records: [{ start: 1 }],
                expected: null,
            },
            {
                records: [{ duration: 1 }],
                expected: wrap_expected({
                    average: 1,
                    mean: 1,
                    interquartile_mean: 1,
                    median: 1,
                    interquartile_range: 0,
                    durations: [ 1 ],
                    interquartile_durations: [ 1 ],
                    standard_deviation: 0,
                    interquartile_standard_deviation: 0,
                }),
            },
            {
                records: [{ duration: 1 }, { start: 1 }],
                expected: wrap_expected({
                    average: 1,
                    mean: 1,
                    interquartile_mean: 1,
                    median: 1,
                    interquartile_range: 0,
                    durations: [ 1, null ],
                    interquartile_durations: [ 1 ],
                    standard_deviation: 0,
                    interquartile_standard_deviation: 0,
                }),
            },
            {
                records: [1,1,1,1].map( d => ({ duration: d }) ),
                expected: wrap_expected({
                    average: 1,
                    mean: 1,
                    interquartile_mean: 1,
                    median: 1,
                    interquartile_range: 0,
                    durations: [ 1, 1, 1, 1 ],
                    interquartile_durations: [ 1, 1 ],
                    standard_deviation: 0,
                    interquartile_standard_deviation: 0,
                }),
            },
            {
                records: [-10,1,1,11].map( d => ({ duration: d }) ),
                expected: wrap_expected({
                    average: 0.75,
                    mean: 0.75,
                    interquartile_mean: 1,
                    median: 1,
                    interquartile_range: 0,
                    durations: [ -10, 1, 1, 11 ],
                    interquartile_durations: [ 1, 1 ],
                    standard_deviation: 7.428828979051813,
                    interquartile_standard_deviation: 0,
                }),
            },
        ];

        tests.forEach(function(test) {
            expect(
                new_sleep_diary(wrap_input({
                    "file_format": "Standard",
                    "records": test.records,
                })).summarise_records()
            ).toEqual(test.expected);
        });

    });

    it(`calculates the correct sleep/wake status`, function() {

        var tests = [
            {
                records: [],
                expected: "",
            },
            {
                records: [ { status: "awake" } ],
                expected: "awake",
            },
            {
                records: [ { status: "asleep" } ],
                expected: "asleep",
            },
            {
                records: [ { status: "awake" }, { status: "asleep" } ],
                expected: "asleep",
            },
            {
                records: [ { status: "asleep" }, { status: "awake" } ],
                expected: "awake",
            },
        ];

        tests.forEach(function(test) {
            expect(
                new_sleep_diary(wrap_input({
                    "file_format": "Standard",
                    "records": test.records,
                })).latest_sleep_status()
            ).toEqual(test.expected);
        });

    });

});
