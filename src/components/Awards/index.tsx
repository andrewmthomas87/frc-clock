import { observer } from 'mobx-react'
import * as React from 'react'

import config from 'config'
import state from 'state'
import { ITeamAward } from 'tba'

import './component.less'

interface IAwardSimple {
	key: string
	name: string
	event: string
	blue: boolean
}

const BLUE_AWARD_TYPES: number[] = [0, 1, 3]

interface IProps extends React.Props<void> { }

const Awards: React.StatelessComponent<IProps> = (): JSX.Element => {
	const $teamNumber: number = state.get$TeamNumber()
	const $teamAwards: ITeamAward[] | false | null | undefined = state.get$TeamAwards($teamNumber)

	if ($teamAwards) {
		const awards: Map<number, IAwardSimple[]> = new Map()

		const minimumYear: number = new Date().getFullYear() - config.eventYearCount + 1
		$teamAwards
			.filter(award => award.year >= minimumYear)
			.sort((a, b) => a.year === b.year ? 0 : (a.year < b.year ? 1 : -1))
			.forEach((award: ITeamAward) => {
				if (award.name.toLowerCase().indexOf('wood') > -1) {
					console.log(award.award_type)
				}

				let simpleAward: IAwardSimple = {
					key: award.event_key,
					name: award.name.replace('Winners', 'Winner').replace('Finalists', 'Finalist').trim(),
					event: `${award.year} ${state.getEventName(award.event_key)}`,
					blue: BLUE_AWARD_TYPES.indexOf(award.award_type) > -1
				}

				if (awards.has(award.year)) {
					(awards.get(award.year) as IAwardSimple[]).push(simpleAward)
				}
				else {
					awards.set(award.year, [simpleAward])
				}
			})

		const awardsElements: JSX.Element[] = []
		awards.forEach((yearsAwards: IAwardSimple[], year: number) => {
			awardsElements.push(<h2 key={year}>{year}</h2>)

			let yearsAwardsElements: JSX.Element[]
			if (yearsAwards.length) {
				yearsAwardsElements = yearsAwards.map((award: IAwardSimple, index: number) => (
					<a key={`${year}-${index}`} className={`award ${award.blue ? 'blue' : ''}`} href={`https://www.thebluealliance.com/event/${award.key}#awards`} target='_blank'>
						<span className='name'><span>{award.name.split('sponsored')[0].trim()}</span></span>
						<span className='event'><span>{award.event}</span></span>
					</a>
				))
			}
			else {
				yearsAwardsElements = [<h3 key={`${year}-0`}>No awards</h3>]
			}
			awardsElements.push(<div key={`${year}-awards`} className='years-awards'>{yearsAwardsElements}</div>)
		})

		return (
			<div className='awards'>
				{awardsElements}
			</div>
		)
	}
	else {
		return <div className='awards' />
	}
}

export default observer(Awards)
