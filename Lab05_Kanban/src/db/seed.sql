INSERT INTO columns (name, ord)
SELECT 'Todo', 1
WHERE NOT EXISTS (SELECT 1 FROM columns WHERE name = 'Todo');

INSERT INTO columns (name, ord)
SELECT 'Doing', 2
WHERE NOT EXISTS (SELECT 1 FROM columns WHERE name = 'Doing');

INSERT INTO columns (name, ord)
SELECT 'Done', 3
WHERE NOT EXISTS (SELECT 1 FROM columns WHERE name = 'Done');
