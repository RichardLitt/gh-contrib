'use strict'

import test from 'ava'

const q = require('../src/queries')

const sum = arr => arr.reduce((acc, n) => acc + n, 0)

test('flatten flattens arrays of arrays', t => {
  const a1 = [[1, 2, 0, 2], [2, 3], [4]]
  t.is(sum(q.flatten(a1)), 14)
})

test('flatten only flattens one level deep', t => {
  const a2 = [[[1], [2, 3]], [1]]
  t.deepEqual(q.flatten(a2), [[1], [2, 3], 1])
})

const dates = [
  {createdAt: new Date('2016-09-24')},
  {createdAt: new Date('2015-09-24')},
  {createdAt: new Date('2014-09-24')},
  {createdAt: new Date('2017-09-24T19:30')},
  {createdAt: new Date('2017-09-24T12:00')},
  {createdAt: new Date('2017-09-24T04:15')}
]

const tf = q.timeFilter
const fdate = new Date('2017-09-24')

test('Time filtering defaults', t => {
  t.is(tf()(dates).length, 6)
  t.is(tf(fdate)(dates).length, 3)
  t.is(tf(undefined, fdate)(dates).length, 3)
})

test('time filtering granularity', t => {
  t.is(tf(fdate, fdate)(dates).length, 0)
  t.is(tf(new Date('2017-09-24T11:00'), new Date('2017'))(dates).length, 1)
})

test('time filtering <=', t => {
  t.is(tf(fdate, fdate)([{createdAt: fdate}]).length, 1)
})

test('merge', t => {
  const testusers = [{login: 'x', count: 1, name: 'x', url: 'x'},
                     {login: 'y', count: 1, name: 'x', url: 'x'},
                     {login: 'x', count: 3, name: 'x', url: 'x'},
                     {login: 'z', count: 2, name: 'x', url: 'x'}]

  t.deepEqual(q.mergeContributions(testusers), [
    {login: 'x', count: 4, name: 'x', url: 'x'},
    {login: 'y', count: 1, name: 'x', url: 'x'},
    {login: 'z', count: 2, name: 'x', url: 'x'}
  ])
  // Objects don't get modified when counting:
  t.deepEqual(q.mergeArrays(testusers, testusers), [
    {login: 'x', count: 8, name: 'x', url: 'x'},
    {login: 'y', count: 2, name: 'x', url: 'x'},
    {login: 'z', count: 4, name: 'x', url: 'x'}
  ])
})

test('null users get filtered', t => {
  const ulist = [{author: {login: 'me', name: 'just me'}}, {author: null}]
  t.deepEqual(q.users(ulist), [{login: 'me', name: 'just me', count: 1}])
})
