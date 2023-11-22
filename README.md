SpellTower Solver
==================

Demo <a href="http://stringham.me/solver">here</a>


About
-------------------
I forked Ryan Stringham's SpellTower Solver, hoping to update it and customize it for my personal use.

SpellTower was created by Zach Gage, an indie game designer/developer. His newest venture, [Puzzmo](https://launch.puzzmo.com), is a puzzle hub that releases a new set of puzzles every day, including Gage's SpellTower.

The [original SpellTower](http://www.spelltower.com) differs a bit from the Puzzmo version, but they have the same mechanics at their core. Puzzmo doesn't have all of the different modes that the original SpellTower does (Tower, Rush, Zen, Blitz, etc.), so the scoring mechanics that are involved in the Puzzmo version are of comparatively greater importance.


Things I'd like to implement
-------------------
[x] Change default board size to 9x13
[x] Modify CSS to accommodate width > 8 columns
[] Automatically distinguish rare tiles by color (JQXZ)
[] Clear the entire row when a rare tile is used in a word
[] Be able to toggle cells to indicate star tile status (2x, 3x, or 4x multiplier)
[] Add solid blank tiles
[] Clear solid blank tile when a word is made next to it
[] Optimize strategy (maybe using backtracking) for full clear (1,000 pt bonus!)