import React from 'react'
import Section from '@/components/Section'
import Container from '@/components/Container'
import { SKILL_CATEGORIES } from '@/data/skills'

export default function Skills() {
    return (
        <Section id="skills" className="py-12 md:py-20">
            <Container>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-8">
                    Skills
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {SKILL_CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            className="group rounded-2xl border border-border bg-panel/50 p-6 transition-all duration-300 hover:border-[var(--color-accent-pink)] backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="text-[var(--color-accent-pink)] transition-colors">
                                    <category.icon className="size-5" />
                                </div>
                                <h3 className="font-medium text-text">{category.title}</h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center rounded bg-white/5 px-2.5 py-1 text-xs font-medium text-subtext transition-colors hover:bg-accent-pink/10 hover:text-accent-pink cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    )
}
