import { describe, it, expect } from 'vitest'
import {
  canTransition,
  canMessage,
  isDecided,
  isEditable,
  type Actor,
} from '@/lib/applications-state'
import { ApplicationStatusSchema, type ApplicationStatus } from '@/lib/schemas'

const ALL = ApplicationStatusSchema.options as readonly ApplicationStatus[]

describe('applicant transitions', () => {
  it('submits a draft', () => {
    expect(canTransition('DRAFT', 'PENDING', 'APPLICANT')).toBe(true)
  })

  it('withdraws from any live state', () => {
    for (const from of ['DRAFT', 'PENDING', 'ACCEPTED'] as ApplicationStatus[]) {
      expect(canTransition(from, 'WITHDRAWN', 'APPLICANT')).toBe(true)
    }
  })

  it('cannot accept or decline itself', () => {
    expect(canTransition('PENDING', 'ACCEPTED', 'APPLICANT')).toBe(false)
    expect(canTransition('PENDING', 'DECLINED', 'APPLICANT')).toBe(false)
  })

  it('cannot resurrect a withdrawn application', () => {
    for (const to of ALL) {
      expect(canTransition('WITHDRAWN', to, 'APPLICANT')).toBe(false)
      expect(canTransition('WITHDRAWN', to, 'ORGANISER')).toBe(false)
    }
  })
})

describe('organiser transitions', () => {
  it('decides a pending application either way', () => {
    expect(canTransition('PENDING', 'ACCEPTED', 'ORGANISER')).toBe(true)
    expect(canTransition('PENDING', 'DECLINED', 'ORGANISER')).toBe(true)
  })

  it('can change its mind after deciding', () => {
    expect(canTransition('ACCEPTED', 'DECLINED', 'ORGANISER')).toBe(true)
    expect(canTransition('DECLINED', 'ACCEPTED', 'ORGANISER')).toBe(true)
  })

  it('cannot submit or withdraw on the volunteer’s behalf', () => {
    expect(canTransition('DRAFT', 'PENDING', 'ORGANISER')).toBe(false)
    expect(canTransition('PENDING', 'WITHDRAWN', 'ORGANISER')).toBe(false)
  })

  it('cannot see, let alone decide, a draft', () => {
    expect(canTransition('DRAFT', 'ACCEPTED', 'ORGANISER')).toBe(false)
    expect(canTransition('DRAFT', 'DECLINED', 'ORGANISER')).toBe(false)
  })
})

describe('no self-transitions', () => {
  it('rejects every status to itself, for both actors', () => {
    for (const status of ALL) {
      for (const actor of ['APPLICANT', 'ORGANISER'] as Actor[]) {
        expect(canTransition(status, status, actor)).toBe(false)
      }
    }
  })
})

describe('derived rules', () => {
  it('only a draft is still editable', () => {
    expect(isEditable('DRAFT')).toBe(true)
    for (const status of ALL.filter((s) => s !== 'DRAFT')) {
      expect(isEditable(status)).toBe(false)
    }
  })

  it('messaging stays open after a decision but closes on withdrawal', () => {
    expect(canMessage('ACCEPTED')).toBe(true)
    expect(canMessage('DECLINED')).toBe(true)
    expect(canMessage('WITHDRAWN')).toBe(false)
  })

  it('counts accepted and declined as decided', () => {
    expect(isDecided('ACCEPTED')).toBe(true)
    expect(isDecided('DECLINED')).toBe(true)
    expect(isDecided('PENDING')).toBe(false)
    expect(isDecided('DRAFT')).toBe(false)
  })
})
