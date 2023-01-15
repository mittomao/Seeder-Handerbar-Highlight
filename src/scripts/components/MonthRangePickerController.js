import JpControllerBase from '../libs/JpControllerBase';

function MonthRangePickerController($el, options) {
	const _self = this;
	_self.$el = $el;
	_self.$inputStartDate = _self.$el.find('.js-input-start-date');
	_self.$inputEndDate = _self.$el.find('.js-input-end-date');

	_self.ACTIONS = {
		CHANGE_YEAR: 'CHANGE_YEAR',
		CHOOSE_MONTH: 'CHOOSE_MONTH',
		APPLY_DATE: 'APPLY_DATE'
	};


	_self.useState({
		startDate: '',
		endDate: '',
		year: '2022'
	});

	JpControllerBase.call(_self, $el, options);

	_self.dispatch = dispatch.bind(_self);
	_self._handleChangeYear = _handleChangeYear.bind(_self);
	_self.renderPopup = renderPopup.bind(_self);
	_self._handleChooseMonth = _handleChooseMonth.bind(_self);
	_self._handleApplyDate = _handleApplyDate.bind(_self);
}


function renderPopup(data) {
	const _self = this;
	$('.js-popup-range').remove();
	const templateListMonth = renderTemplateMonth(data);

	const template = `<div class="popup-range js-popup-range">
						<div class="popup-range__body">
							<strong>Select month Range</strong>
							<div class="slider-date">
								<span class="js-arrow-prev ${data.startDate ? 'disable' : ''}"><</span>
								<input type="text" class="js-current-date" value ="${data.year}"/>
								<span class="js-arrow-next ${data.endDate ? 'disable' : ''}">></span>
							</div>
							<div class="months js-list-months">	
								${templateListMonth}			
							</div>
							<div class="popup-range__results">
								From <span class="from-date">${data.startDate}</span> to <span class="to-date">${data.endDate}</span>
							</div>
						</div>	
						<div class="popup-range__controls">
							<button type="button" class="confirm btn btn-primary js-btn-apply">Apply</button>
						</div>
					</div>`;
	_self.$el.append(template);
	// Init Dom
	_self.$container = $('.js-popup-range');
	_self.$months = _self.$container.find('.js-list-months');
	_self.btnPrev = _self.$container.find('.js-arrow-prev');
	_self.btnNext = _self.$container.find('.js-arrow-next');
	_self.currentDate = _self.$container.find('.js-current-date');
	_self.items = _self.$container.find('.js-month-item');
	_self.btnApply = _self.$container.find('.js-btn-apply');


	// Init Event

	_self.btnPrev.on('click', function () {
		const val = parseInt(_self.currentDate.val(), 10);
		_self.dispatch({
			type: _self.ACTIONS.CHANGE_YEAR,
			year: val - 1
		});
	});

	_self.btnNext.on('click', function () {
		const val = parseInt(_self.currentDate.val(), 10);
		_self.dispatch({
			type: _self.ACTIONS.CHANGE_YEAR,
			year: val + 1
		});
	});

	_self.items.on('click', function (e) {
		e.preventDefault();
		const month = $(e.target).data('month').toString();
		const year = _self.currentDate.val();
		_self.dispatch({
			type: _self.ACTIONS.CHOOSE_MONTH,
			date: `${month} ${year}`
		});
	});

	_self.btnApply.on('click', function () {
		_self.dispatch({
			type: _self.ACTIONS.APPLY_DATE
		});
	});
}

function renderTemplateMonth(data) {
	let template = '';
	for (let i = 0; i < 12; i++) {
		let date = new Date(0, i, 1);
		let month = date.toLocaleString('default', { month: 'long' });
		let number = ('0' + (i + 1)).slice(-2);
		let about = '';
		let fullDate = `${month} ${data.year}`;
		if (data.startDate && data.endDate) {
			let sM = new Date(data.startDate);
			let eM = new Date(data.endDate);
			let cM = new Date(fullDate);
			about = (cM > sM && cM < eM) ? 'disable' : '';
		}

		template += `<a class="month js-month-item ${data.startDate === fullDate ? 'start' : ''} ${data.endDate === fullDate ? 'end' : ''} ${about}" data-month= "${month}"> ${month} </a>`;
	}
	return template;
}

function dispatch(action) {
	const _self = this;
	const state = _self.getState();

	switch (action.type) {
		case _self.ACTIONS.CHANGE_YEAR:
			return _self._handleChangeYear(action, state);
		case _self.ACTIONS.CHOOSE_MONTH:
			return _self._handleChooseMonth(action, state);
		case _self.ACTIONS.APPLY_DATE:
			return _self._handleApplyDate(state);
		default:
			return;
	}
}

function _handleChangeYear(action, state) {
	const _self = this;
	const newState = { ...state };
	if (action.year !== state.year) {
		newState.year = action.year;
		_self.setState(newState);
	}
}

function _handleChooseMonth(action, state) {
	const _self = this;
	const newState = { ...state };
	if (state.startDate && state.endDate) {
		return;
	} else {
		if (!state.startDate) {
			newState.startDate = action.date;
		} else {
			newState.endDate = action.date;
		}

		_self.setState(newState);
	}
}

function _handleApplyDate(state) {
	const _self = this;
	if (state.startDate) {
		_self.$inputStartDate.val(state.startDate);
	}

	if (state.endDate) {
		_self.$inputEndDate.val(state.endDate);
	}
}

MonthRangePickerController.prototype = Object.create(JpControllerBase.prototype);

MonthRangePickerController.prototype.render = function (state) {
	const _self = this;
	_self.renderPopup(state);
};

export default MonthRangePickerController;
