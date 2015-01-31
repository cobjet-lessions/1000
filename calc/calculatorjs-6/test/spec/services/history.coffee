'use strict'

describe 'Service: History', () ->

	# load the service's module
	beforeEach module 'calculator3App'

	# instantiate service
	History = {}
	$httpBackend = null
	beforeEach inject (_History_, _$httpBackend_) ->
		History = _History_
		$httpBackend = _$httpBackend_

	it 'should exists', () ->
		expect(History).to.exist

	it 'should get the history', () ->
		$httpBackend.expectGET('/api/history?').respond [{calcul: '5/3'}, {calcul: '123*6.3'}]
		items = History.getAll()
		$httpBackend.flush()
		expect(items).to.have.length(2)

	it 'should post the history', () ->
		$httpBackend.expectPOST('/api/history', {calcul: '1+2'}).respond {}
		history = new History {calcul: '1+2'}
		history.$save()
		$httpBackend.flush()