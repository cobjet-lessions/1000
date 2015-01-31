'use strict'

describe 'Directive: calculator', () ->

	# load the directive's module
	beforeEach module 'calculator3App', 'templates-main'

	scope = {}
	element = null
	$httpBackend = null

	beforeEach inject ($controller, $rootScope, $compile, _$httpBackend_) ->
		$httpBackend = _$httpBackend_
		scope = $rootScope.$new()
		element = angular.element '<calculator></calculator>'
		element = $compile(element) scope
		$httpBackend.expectGET('/api/history?').respond [{calcul: '5/3'}, {calcul: '123*6.3'}]
		scope = element.scope()
		scope.$apply()
	
	it 'should load the template', () ->
		buttons = element.find("#commands .row a")
		expect(buttons).to.have.length(19)

	simulateCalculation = (c, result) ->
		$httpBackend.expectPOST('/api/history', {calcul: c}).respond {}
		scope.input = c
		scope.calculate()
		scope.$digest()
		expect(element.find('#input').val()).to.equal(result)

	it 'should calculate addition', () ->
		simulateCalculation '1 + 3.5', '4.5'

	it 'should calculate multiplication', () ->
		simulateCalculation '9 * 6546.32', '58916.88'

	it 'should calculate a complex calculation', () ->
		simulateCalculation '((3.6774 * 2.776) + 8.986) / 4', '4.7986156'

	it 'should reset the input', () ->
		input = element.find('#input')
		scope.input = '1 + 2'
		scope.$digest()
		expect(input.val()).to.equal('1 + 2')
		scope.reset()
		scope.$digest()
		expect(input.val()).to.equal('')

	it 'should return an error because of an invalid syntax - 1', () ->
		scope.input = '1 + 2 ('
		scope.calculate()
		scope.$digest()
		expect(scope.error).to.exist

	it 'should return an error because of an invalid syntax - 2', () ->
		scope.input = "tutu = 'tata'"
		scope.calculate()
		scope.$digest()
		expect(scope.error).to.exist
